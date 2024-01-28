import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { faqItems, FaqItem } from "../../constants/faq";
import styles from "./faqPage.module.scss";
import Layout from "../../components/layout/Layout";

type OpenDetails = Record<string, boolean>;

const FaqPage = () => {
	const [openDetails, setOpenDetails] = useState<OpenDetails>({});

	const toggleOpen = (key: string) => {
		setOpenDetails((prevOpenDetails: OpenDetails) => ({
			...prevOpenDetails,
			[key]: !prevOpenDetails[key],
		}));
	};

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLElement>,
		key: string
	) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			toggleOpen(key);
		}
	};

	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};
	const faqSectionFaqs = faqItems.reduce((acc, item, index) => {
		const sectionFaq = capitalizeFirstLetter(item.section);
		const key = `${sectionFaq}-${index}`;
		if (!acc[sectionFaq]) {
			acc[sectionFaq] = [];
		}
		acc[sectionFaq].push({ ...item, key });
		return acc;
	}, {} as Record<string, (FaqItem & { key: string })[]>);

	const addSpacesToCamelCase = (string: string) => {
		return string
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase());
	};

	return (
		<>
			<Layout>
				<div className={styles.faqPage}>
					<h1>FAQ</h1>
					{Object.entries(faqSectionFaqs).map(
						([sectionFaq, items], sectionFaqIndex) => (
							<div key={sectionFaq}>
								<h2 className={styles.sectionFaqTitle}>
									{addSpacesToCamelCase(sectionFaq)}
								</h2>
								{items.map((item, itemIndex) => {
									const key = `${sectionFaq}-${itemIndex}`;
									const isOpen = openDetails[key];
									return (
										<details key={key} className={styles.faqItem}>
											<summary
												onClick={() => toggleOpen(key)}
												onKeyDown={(event) => handleKeyDown(event, key)}
												tabIndex={0}
											>
												{capitalizeFirstLetter(item.question)}
												<span className={styles.icon}>
													{isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
												</span>
											</summary>
											{isOpen && <p>{item.answer}</p>}
										</details>
									);
								})}
							</div>
						)
					)}
				</div>
				<div className={styles.WaveImage}></div>
			</Layout>
		</>
	);
};

export default FaqPage;
