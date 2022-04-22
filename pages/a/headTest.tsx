import commonHead from "../../components/commonhead"
import GenericProp from "../../components/PropType"

const headTest = () => {
    return (
        <>
			<p>Head Test Page</p>
            <GenericProp />
		</>
    )
}

export default commonHead(headTest, '헤더', '페이지 소개')