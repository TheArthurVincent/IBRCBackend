const editWeeklyClasses = async (student, weeklyClasses) => {
    if (!weeklyClasses) return
    if (student.weeklyClasses !== weeklyClasses) {
        student.weeklyClasses = weeklyClasses;
        return `Aulas semanais alteradas para ${weeklyClasses}`;
    }
    return null;
};

module.exports = editWeeklyClasses