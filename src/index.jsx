import { createRoot } from 'react-dom/client';
import { Container } from 'react-bootstrap';
import { MainView } from './components/main-view/main-view.jsx';
// Directly import Bootstrap CSS (if not already imported in index.scss)
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

const App = () => {
	return (
		<Container fluid>
			<MainView />
		</Container>
	);
};

const container = document.querySelector('#root');
// Ensure container is not null
if (container) {
	const root = createRoot(container);
	root.render(<App />);
} else {
	console.error('Root container not found');
}
