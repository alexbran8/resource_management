const initialState = {
    projects: []
};

const projectsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE DISPLAY': return ({
            ...state,
            projects: state.projects.map((project, index) => {
                if (index !== action.payload) {
                    return project;
                }
                return {
                    ...project,
                    display: !project.display
                }
            })
        });
        case 'ENABLE BUTTON': return ({
            ...state,
            projects: state.projects.map((project, index) => {
                if (index !== action.index) {
                    return project;
                }
                return {
                    ...project,
                    buttonDisabled: false
                }
            })
        });
        case 'SET DEFAULT VALUE': return ({
            ...state,
            projects: state.projects.map((project, index) => {
                if (index !== action.index) {
                    return project;
                }
                return (
                    {
                        ...project,
                        tsks: project.tsks.map(task => {
                            return (
                                {
                                    ...task,
                                    competenceLevel: action.value,
                                }
                            )
                        }),
                        verifiedTasks: 0,
                    }
                );
            })
        });
        case 'SET TASK COMPETENCE LEVEL': return ({
            ...state,
            projects: state.projects.map((project, index) => {
                if (index !== action.projectIndex) {
                    return project;
                }
                return (
                    {
                        ...project,
                        tsks: project.tsks.map((task, index) => {
                            if (index !== action.taskIndex)
                                return task;
                            return (
                                {
                                    ...task,
                                    competenceLevel: action.value,
                                }
                            )
                        }),
                    }
                );
            })
        });
        case 'REVIEW TASK': return ({
            ...state,
            projects: state.projects.map((project, pIndex) => {
                if (pIndex !== action.payload.projectIndex) {
                    return project;
                }

                let ok;
                return (
                    {
                        ...project,
                        tsks: project.tsks.map((task, tIndex) => {
                            if (tIndex !== action.payload.taskIndex) {
                                return task;
                            }
                            ok = !task.reviewed;
                            return ({
                                ...task,
                                reviewed: !task.reviewed,
                            });
                        }),
                        verifiedTasks: ok ? project.verifiedTasks + 1 : project.verifiedTasks - 1,
                    }
                );
            })
        });
        case 'GET PROJECTS': return({
            ...state,
            projects: action.payload.data,
        });
        default: return { ...state };
    }
}

export default projectsReducer;