import "./App.scss";
import Footer from "./components/common/footer/Footer";
import InteractiveMap from "./components/interactiveMap/InteractiveMap";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>City Guide</h1>
			</header>
			<div>
				<InteractiveMap />
			</div>
			<Footer />
		</div>
	);
}

export default App;
