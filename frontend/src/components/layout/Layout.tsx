import { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";
import useWindowDimensions from "../../utils/hooks/useWindowDimensions";

const Layout = ({ children }: PropsWithChildren) => {
	const windowSize = useWindowDimensions();
	let location = useLocation();
	const isPageWithoutHeaderAndFooter =
		(location.pathname.includes("register") && windowSize > 768) ||
		(location.pathname.includes("login") && windowSize > 768) ||
		(location.pathname.includes("contribution") && windowSize > 768);

	const isDashboardPage = location.pathname.includes("dashboard");

	return (
		<>
			{!isPageWithoutHeaderAndFooter && (
				<Header size={windowSize > 768 ? "desktop" : "mobile"} />
			)}

			{children}

			{!isPageWithoutHeaderAndFooter &&
				!isDashboardPage &&
				windowSize > 768 && <Footer />}
		</>
	);
};

export default Layout;
