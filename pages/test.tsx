import Link from 'next/link'

export default function testpage () {
    return (
        <>
            <h1>yeah</h1>
            <p>Link 이동: <Link href="/a/b"><a>여기루</a></Link></p>
            <p>Anchor 이동: <a href="/a/b">여기루</a></p>
        </>
    )
}