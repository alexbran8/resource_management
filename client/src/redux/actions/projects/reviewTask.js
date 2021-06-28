export const reviewTask = (projectIndex, taskIndex) => {
    return {
        type: 'REVIEW TASK',
        payload: {
            projectIndex: projectIndex,
            taskIndex: taskIndex,
        },
    }
}