/**
 * Banner at top of website.
 * @param {Object} props
 * @param {*} props.search Handle function to search for questions.
 * @param {*} props.userProfile Handle function to view the user's profile.
 * @param {*} props.logout Logout function for logging out the user.
 */
export default function Banner({search, userProfile, logout}) {
  return (
    <div id="banner">
      <h1>Fake Stack Overflow</h1>
      <input id="searchbar" placeholder="Search . . ." onKeyDown={e => search(e.key, e.target.value.trim())} />
      {logout !== null && <button id="profile" className="click" onClick={userProfile}>Profile</button>}
      {logout !== null && <button id="logout" className="click" onClick={logout}>Log Out</button>}
    </div>
  );
}
