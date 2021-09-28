import React from 'react'



export const HowTo = () => {

    return (
        <div>
            <h1>How to?</h1>
            <section>
                <aside>

                </aside>
                <article>
            <h2>Assign user as admin</h2>
            <ol>
            <li>Go to <a target="blank" href="https://portal.azure.com/#home">Azure Platform</a></li>
            <li>Find <b>Enterprise Applications</b></li>
            <li>Search application by name (<b>nokiaplanningtool</b>)</li>
            <li>Click on <b>Users and Groups</b></li>
            <li>Click on <b>Add user/group</b></li>
            <li>Select on user by email from <b>Users and groups</b></li>
            <li>Select role as <b>admin</b> <b>Select a role</b></li>
            <li>Click on <b>assign</b></li>
            </ol>
            </article>
            </section>
        </div>
    )
}