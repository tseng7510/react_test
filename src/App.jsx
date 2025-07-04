import Home from './pages/Home';
import About from './pages/About';
import './scss/basic/_normalize.scss';
import './scss/template.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import './scss/App.scss'; // 為了清楚看到 MUI 效果，暫時註解掉自訂樣式
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom';

function Root() {
  return (
    <>
      <header>
        <div className='container'>
          <h1>閱讀履歷</h1>
        </div>
      </header>

      <main>
        <div className='container'>
          <nav className='topNav'>
            <Link to='/'>Home</Link> | <Link to='/about'>About</Link>
          </nav>

          <div className='mainBox'>
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ],
  {
    basename: '/react_test/',
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
