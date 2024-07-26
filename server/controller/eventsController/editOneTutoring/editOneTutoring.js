const { default: mongoose } = require("mongoose");
const { Events_Model } = require("../../../models/Events");
const { Student_Model } = require("../../../models/Students");

/**
 * Controller para editar uma tutoria existente e atualizar eventos associados.
 * 
 * @param {Object} req - O objeto de requisição Express, contendo os detalhes da tutoria a ser editada no corpo da requisição.
 * @param {Object} res - O objeto de resposta Express usado para retornar a resposta ao cliente.
 * @returns {Promise<void>} - Uma Promise que resolve quando a resposta for enviada.
 */
const events_edit1Tutoring = async (req, res) => {
    // Obtém os detalhes da tutoria a ser editada do corpo da requisição.
    const { id, day, time, link, studentID } = req.body;

    try {
        // Verifica se todos os parâmetros necessários foram fornecidos.
        if (!id || !day || !time || !link || !studentID) {
            // Retorna uma resposta de erro 400 (Bad Request) se informações estiverem faltando.
            return res.status(400).json({ message: "Informações faltantes" });
        }

        // Busca o estudante pelo ID fornecido.
        const student = await Student_Model.findById(studentID);
        if (!student) {
            // Retorna uma resposta de erro 404 (Not Found) se o estudante não for encontrado.
            return res.status(404).json({ message: "Aluno não encontrado" });
        }

        // Remove a tutoria antiga da lista de dias de tutoria do estudante.
        student.tutoringDays = student.tutoringDays.filter(
            (tutoring) => tutoring.id.toString() !== id
        );

        // Cria um novo objeto de tutoria.
        const newTutoring = {
            day,
            time,
            link,
            id: new mongoose.Types.ObjectId(), // Gera um novo ID para a tutoria.
        };

        // Adiciona a nova tutoria à lista de dias de tutoria do estudante.
        student.tutoringDays.push(newTutoring);

        // Salva as alterações no estudante.
        await student.save();

        // Se um ID de tutoria foi fornecido, remove eventos antigos e cria novos eventos.
        if (id) {
            // Remove todos os eventos associados à tutoria antiga que não foram editados.
            await Events_Model.deleteMany({
                tutoringID: id,
                edited: false,
            });

            // Função auxiliar para obter a próxima data do dia da semana especificado a partir de uma data inicial.
            const getNextDayOfWeek = (dayOfWeek, fromDate) => {
                const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const targetDay = daysOfWeek.indexOf(dayOfWeek);
                const currentDay = fromDate.getDay();
                const daysUntilTarget = targetDay - currentDay;
                const nextDate = new Date(fromDate);
                nextDate.setDate(fromDate.getDate() + daysUntilTarget);
                return nextDate;
            };

            // Obtém a data de hoje e calcula o próximo dia da semana especificado.
            const today = new Date();
            const nextWeekDay = getNextDayOfWeek(day, today);

            // Cria um array de datas para as próximas 42 semanas a partir da data calculada.
            const nextFewWeeks = [];
            for (let i = 0; i < 42; i++) {
                const nextWeek = new Date(
                    nextWeekDay.getTime() + 7 * 24 * 60 * 60 * 1000 * i
                );
                nextFewWeeks.push(nextWeek);
            }

            // Cria eventos recorrentes para cada uma das próximas 42 semanas.
            const eventsPromises = nextFewWeeks.map(async (nextWeek) => {
                const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const nextWeekDaySameDay = new Date(nextWeek);

                // Calcula a data do próximo dia da semana específico dentro da semana.
                nextWeekDaySameDay.setDate(
                    nextWeekDaySameDay.getDate() +
                    ((daysOfWeek.indexOf(day) + 7 - nextWeekDaySameDay.getDay()) % 7)
                );

                // Cria a data e hora do evento.
                const eventDate = new Date(
                    nextWeekDaySameDay.getFullYear(),
                    nextWeekDaySameDay.getMonth(),
                    nextWeekDaySameDay.getDate(),
                    time.split(":")[0],
                    time.split(":")[1]
                );

                // Função auxiliar para formatar a hora no formato HH:MM.
                const formatTime = (timeStr) => {
                    const [hours, minutes] = timeStr.split(":");
                    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
                };

                // Cria um novo evento com os detalhes fornecidos.
                const newEvents = new Events_Model({
                    studentID,
                    student: student.name + " " + student.lastname,
                    description: null,
                    link,
                    date: eventDate.toISOString().slice(0, 10), // Formata a data no formato YYYY-MM-DD.
                    time: formatTime(time),
                    category: "Tutoring",
                    tutoringID: newTutoring.id,
                });

                // Salva o novo evento e retorna o evento salvo.
                await newEvents.save();
                return newEvents;
            });

            // Espera que todas as promessas de eventos sejam resolvidas.
            await Promise.all(eventsPromises);
        }

        // Retorna uma resposta de sucesso com o estudante atualizado.
        return res.status(200).json({ student });
    } catch (error) {
        // Loga o erro para depuração e retorna uma resposta de erro 500 (Internal Server Error).
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { events_edit1Tutoring };
