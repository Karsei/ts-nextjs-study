type YahoProps = {
    ya: string,
    ho: string,
}

//const GenericProp: React.FC<YahoProps> = ({ya, ho}) => {
const GenericProp = ({ya, ho}: YahoProps) => {
    return (
        <>
            <p>야호?</p>
            <ul>
                <li>{ya}</li>
                <li>{ho}</li>
            </ul>
        </>
    )
}

GenericProp.defaultProps = {
    ya: '야무지게 먹는',
    ho: '호랑이',
}

export default GenericProp;