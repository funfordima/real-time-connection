// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import LongPolling from './long-polling';

import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <LongPolling />
      <NxWelcome title="react-web" />
    </div>
  );
}

export default App;
