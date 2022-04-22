import Head from 'next/head';

const commonHead = (Component: any, title: string, description: string) => {
	const head = (props: any) => {
		return (
			<>
				<Head>
					<title>{title}</title>
					<meta name="description" content={description} />
				</Head>
				<Component {...props}/>
			</>

		);
	};
	return head;
};

export default commonHead;