/**
 * Upvote and downvote buttons.
 * @param {Object} props
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.votes Number of votes of question or answer.
 * @param {*} props.upvote Function to upvote a question, answer, or comment.
 * @param {*} props.downvote Function to downvote a question, answer, or comment.
 */
export default function Vote({logout, votes, upvote, downvote}) {
  return (
    <div className="vote">
      {(logout !== null && upvote !== null) && <button onClick={upvote}>/\</button>}
      {(logout === null || upvote === null) && <button disabled>/\</button>}
      <p>{votes}</p>
      {(logout !== null && downvote !== null) && <button onClick={downvote}>\/</button>}
      {(logout === null || downvote === null) && <button disabled>\/</button>}
    </div>
  );
}
