export const getProjects = (data) => {
    return {
        type: 'GET PROJECTS',
        payload: {
            data: data
        }
    }
}