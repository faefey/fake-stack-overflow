/**
 * Buttons used to go to previous and next items.
 * @param {Object} props
 * @param {*} props.i Current start index.
 * @param {*} props.show Number of items to show at a time.
 * @param {*} props.len Total number of items.
 * @param {*} props.prev Handle function to go to previous items.
 * @param {*} props.next Handle function to go to next items.
 */
export default function PrevNext({i, show, len, prev, next}) {
  return (
    <div>
      {i === 0 && <button className="prevnext" disabled>Prev</button>}
      {i > 0 && <button className="prevnext" onClick={prev}>Prev</button>}
      {len <= show && <button className="prevnext" disabled>Next</button>}
      {len > show && <button className="prevnext" onClick={() => next(len)}>Next</button>}
    </div>
  );
}
