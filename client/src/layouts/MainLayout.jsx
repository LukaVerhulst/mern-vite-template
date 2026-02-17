import { Outlet } from "react-router-dom";
{/* import Navbar from "../components/navigation/Navbar"; */}

const MainLayout = () => {
  return (
    <>
      {/* <Navbar /> */}  {/* Shows on every page inside this layout */}
      <main className="min-h-screen p-4">
        <Outlet /> {/* Here is where the current route page renders */}
      </main>
    </>
  );
};

export default MainLayout;
