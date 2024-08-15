import {UserInfo} from "./userprofile.js";

import {formatTime} from "../helper.js";

/**
 * Admin profile and view of all users in database.
 * @param {Object} props
 * @param {*} props.userInfo Information about all users.
 * @param {*} props.userProfile Handle function to view any user profile.
 * @param {*} props.deleteUser Handle function to delete the account of a user.
 */
export default function AdminProfile({userInfo, userProfile, deleteUser}) {
  return (
    <div className="page">
      <UserInfo userInfo={userInfo} />
      <h1 id="users">Users</h1>
      <Users id={userInfo._id} users={userInfo.users} userProfile={userProfile} deleteUser={deleteUser} />
    </div>
  );
}

/**
 * View of all users in database.
 * @param {Object} props
 * @param {*} props.id Id of admin.
 * @param {*} props.users Information about all users.
 * @param {*} props.userProfile Handle function to view any user profile.
 * @param {*} props.deleteUser Handle function to delete the account of a user.
 */
function Users({id, users, userProfile, deleteUser}) {
  if(users.length === 0) {
    return (
      <h1 id="nousersfound">No Users Found</h1>
    );
  }
  else {
    let i = 0;
    let userProfiles = users.map(u => <User id={id} user={u} userProfile={userProfile} deleteUser={deleteUser} key={i++} />);
    return (
      <div id="ulist">
        {userProfiles}
      </div>
    );
  }
}

/**
 * View of a single user.
 * @param {Object} props
 * @param {*} props.id Id of admin.
 * @param {*} props.user Information about a single user.
 * @param {*} props.userProfile Handle function to view any user profile.
 * @param {*} props.deleteUser Handle function to delete the account of a user.
 */
function User({id, user, userProfile, deleteUser}) {
  return (
    <div className="u">
      <p className="uusername" onClick={() => userProfile(user)}>{user.username}</p>
      <p className="uemail">{user.email}</p>
      <p className="urtime">{"Registered: " + formatTime(Date.parse(user.reg_date_time))}</p>
      <p className="ureputation">{"Reputation: " + user.reputation}</p>
      {user._id === id && <button id="deleteuser" className="click" onClick={() => deleteUser(user, true)}>Delete User</button>}
      {user._id !== id && <button id="deleteuser" className="click" onClick={() => deleteUser(user, false)}>Delete User</button>}
    </div>
  );
}
