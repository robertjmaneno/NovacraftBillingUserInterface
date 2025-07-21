
import { Dashboard } from './Dashboard';

const Index = () => {
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Unable to load data. Please try again later.<br />
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  return <Dashboard />;
};

export default Index;
