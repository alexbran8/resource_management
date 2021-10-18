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
            <li>Select role as <b>admin</b> from <b>Select a role</b></li>
            <li>Click on <b>assign</b></li>
            </ol>
            </article>
            <article>
            <h2>Grant permision to user for login</h2>
            <ol>
            <li>Go to <a target="blank" href="https://idm.int.net.nokia.com/IdmGuiWeb/flow/group/my/group?execution=e2s1">NIMS application (it can be found in Tools & Resources on Nokia Central Sharepoint)</a></li>
            <li>Under <b>My Groups</b> search for <b>I_EXT_GDCAPPPS_GMS</b></li>
            <li>Click on <b>Members</b></li>
            <li>Click on <b>Select Identities</b></li>
            <li>Find resource</li>
            <li>Check box</li>
            <li>Save</li>
            </ol>
            </article>
            </section>
        </div>
    )
}