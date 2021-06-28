export const setTaskCompetenceLevel = (projectIndex, taskIndex, value) => {
    return {
        type: 'SET TASK COMPETENCE LEVEL',
        value: value,
        projectIndex: projectIndex,
        taskIndex: taskIndex
    }
}