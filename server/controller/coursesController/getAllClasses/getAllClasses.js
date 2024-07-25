const { CourseClass_Model, ModulesInfo_Model, CourseInfo_Model } = require("../../../models/CourseClass");

/**
 * Função para obter todas as aulas, diferenciando entre cursos aos quais o aluno tem acesso e cursos aos quais não tem acesso.
 *
 * @param {Object} req - O objeto de requisição Express.
 * @param {Object} res - O objeto de resposta Express.
 *
 * @returns {void} - Retorna a resposta HTTP com os detalhes das aulas e cursos.
 */
const courseClasses_getAll = async (req, res) => {
    const { studentId } = req.params;
    try {
        // Busca todos os detalhes das aulas
        const classesDetails = await CourseClass_Model.find();

        // Busca cursos aos quais o aluno tem acesso
        const coursesYes = await CourseInfo_Model.find({
            studentsWhoHaveAccessToIt: studentId,
        });

        // Busca cursos aos quais o aluno não tem acesso
        const coursesNo = await CourseInfo_Model.find({
            studentsWhoHaveAccessToIt: { $ne: studentId },
        });

        // Busca informações sobre os módulos
        const modules = await ModulesInfo_Model.find();

        // Verifica se as aulas foram encontradas
        if (!classesDetails) {
            return res.status(404).json({ error: "Aulas não encontradas" });
        }

        /**
         * Transforma as aulas autorizadas por curso em um formato agrupado e organizado.
         *
         * @param {Array} classes - Lista de aulas.
         * @param {Array} courses - Lista de cursos aos quais o aluno tem acesso.
         * @param {Array} modules - Lista de módulos.
         *
         * @returns {Array} - Lista de cursos com aulas agrupadas e módulos organizados.
         */
        const transformAuthClassesByCourse = (classes, courses, modules) => {
            // Mapeia cursos para facilitar a associação com as aulas
            const coursesMap = courses.reduce((acc, course) => {
                acc[course._id] = { ...course.toObject(), modules: {} };
                return acc;
            }, {});

            // Mapeia módulos para facilitar a associação com as aulas
            const modulesMap = modules.reduce((acc, module) => {
                acc[module._id] = { title: module.title, order: module.order };
                return acc;
            }, {});

            // Associa as aulas aos cursos e módulos
            classes.forEach((lesson) => {
                const course = coursesMap[lesson.courseId];
                if (!course) return;

                const moduleInfo = modulesMap[lesson.module];
                if (!moduleInfo) return;

                if (!course.modules[lesson.module]) {
                    course.modules[lesson.module] = [];
                }
                course.modules[lesson.module].push(lesson);
            });

            /**
             * Ordena os módulos com base na ordem especificada e organiza as aulas dentro de cada módulo.
             *
             * @param {Object} modules - Módulos agrupados por ID.
             *
             * @returns {Array} - Lista de módulos ordenados com aulas.
             */
            const sortModulesByOrder = (modules) => {
                return Object.entries(modules)
                    .sort((a, b) => modulesMap[a[0]].order - modulesMap[b[0]].order)
                    .map(([moduleId, lessons]) => ({
                        module: modulesMap[moduleId]?.title || "Título não encontrado",
                        lessons: lessons.sort((a, b) => a.order - b.order),
                    }));
            };

            return Object.values(coursesMap).map((course) => ({
                ...course,
                modules: sortModulesByOrder(course.modules),
            }));
        };

        /**
         * Transforma as aulas não autorizadas por curso em um formato agrupado e organizado.
         *
         * @param {Array} classes - Lista de aulas.
         * @param {Array} courses - Lista de cursos aos quais o aluno não tem acesso.
         * @param {Array} modules - Lista de módulos.
         *
         * @returns {Array} - Lista de cursos com aulas não autorizadas e módulos organizados.
         */
        const transformNonAuthClassesByCourse = (classes, courses, modules) => {
            // Mapeia cursos para facilitar a associação com as aulas
            const coursesMap = courses.reduce((acc, course) => {
                acc[course._id] = { ...course.toObject(), modules: {} };
                return acc;
            }, {});

            // Mapeia módulos para facilitar a associação com as aulas
            const modulesMap = modules.reduce((acc, module) => {
                acc[module._id] = { title: module.title, order: module.order };
                return acc;
            }, {});

            // Associa as aulas aos cursos e módulos, marcando como "Sem Acesso"
            classes.forEach((lesson) => {
                const course = coursesMap[lesson.courseId];
                if (!course) return;

                const moduleInfo = modulesMap[lesson.module];
                if (!moduleInfo) return;

                if (!course.modules[lesson.module]) {
                    course.modules[lesson.module] = [];
                }
                course.modules[lesson.module].push({ title: "No Access" });
            });

            /**
             * Ordena os módulos com base na ordem especificada e organiza as aulas dentro de cada módulo.
             *
             * @param {Object} modules - Módulos agrupados por ID.
             *
             * @returns {Array} - Lista de módulos ordenados com aulas não autorizadas.
             */
            const sortModulesByOrder = (modules) => {
                return Object.entries(modules)
                    .sort((a, b) => modulesMap[a[0]].order - modulesMap[b[0]].order)
                    .map(([moduleId, lessons]) => ({
                        module: modulesMap[moduleId]?.title || "Título não encontrado",
                        lessons,
                    }));
            };

            return Object.values(coursesMap).map((course) => ({
                ...course,
                modules: sortModulesByOrder(course.modules),
            }));
        };

        // Transforma as aulas autorizadas e não autorizadas em formatos agrupados e organizados
        const groupedAuthClasses = transformAuthClassesByCourse(
            classesDetails,
            coursesYes,
            modules
        );
        const groupedNonAuthClasses = transformNonAuthClassesByCourse(
            classesDetails,
            coursesNo,
            modules
        );

        // Retorna a resposta com o total de aulas e detalhes dos cursos
        res.status(200).json({
            totalOfClasses: classesDetails.length,
            courses: groupedAuthClasses,
            coursesNonAuth: groupedNonAuthClasses,
        });
    } catch (error) {
        console.error("Erro ao obter os detalhes da aula:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = { courseClasses_getAll };
