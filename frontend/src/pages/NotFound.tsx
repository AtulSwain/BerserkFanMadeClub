import { Link } from 'react-router-dom';
import { Page } from '@/components/Page';
import { Balloon, Stamp } from '@/components/Manga';

export default function NotFound() {
  return (
    <Page chapter="Missing page" folio={0}>
      <div className="notfound">
        <span className="label">Error · page torn out</span>
        <Stamp className="notfound__stamp">
          <span lang="ja" className="ja">落丁</span> · missing page
        </Stamp>
        <h1 className="chapter-title">
          This page<br />
          <em>was torn out.</em>
        </h1>
        <Balloon kind="shout">No entry here!</Balloon>
        <p className="annot">no entry exists at this address</p>
        <Link to="/archive" className="bracket bracket--red">
          <span>Return to the index</span>
        </Link>
      </div>
    </Page>
  );
}
