// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import EventSourcing from './event-sourcing';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <EventSourcing />
      <NxWelcome title="react-web" />
    </div>
  );
}

export default App;
