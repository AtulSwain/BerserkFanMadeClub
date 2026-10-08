import { Link } from 'react-router-dom';
import { Page } from '@/components/Page';

export default function NotFound() {
  return (
    <Page chapter="Missing page" folio={0}>
      <div className="notfound">
        <span className="label">Error · page torn out</span>
        <h1 className="chapter-title">
          This page<br />
          <em>was torn out.</em>
        </h1>
        <p className="annot">no entry exists at this address</p>
        <Link to="/archive" className="bracket bracket--red">
          <span>Return to the index</span>
        </Link>
      </div>
    </Page>
  );
}
