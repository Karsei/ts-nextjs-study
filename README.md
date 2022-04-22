# ts-nextjs-study

Next.js (Typescript) 프로젝트 공부용

React 에서 Server Side Rendering (SSR) 을 간단히 구현할 수 있게 도와주는 대표적인 Framework 중 하나. 설정이 손쉬운 것이 장점

SSR 과 Code Spliting 을 지원하며 약간의 정형화된 구조로 되어 있어 이를 따라야 한다. 대표적으로 `pages` 폴더를 통해서 Routing 을 **매우** 간단하게 다룰 수 있고, `api` 폴더를 추가함으로써 간단하게 Backend 를 구현할 수도 있다(Express 와 같은 모듈과 결합이 가능).

> Next.js 는 Webpack 기반으로 제작된 React 기반 프레임워크이기 때문에 아직 정식적으로 Vite 를 지원하지 않는다.

> `vite-plugin-ssr` 이라는 npm 라이브러리와 `Rakkas` 라는 Vite 기반의 프레임워크가 있긴 하나 커뮤니티가 아직 크게 형성되어 있지 않다.

## 생성

처음부터 아무것도 없는 상태에서 시작하려면 해당 라이브러리만 추가하면 된다.

```bash
$ npm install next --save
```

Next.js 는 사용자들이 프로젝트를 바로 시작하기 쉽도록 `create-next-app` 을 지원하고 있다.

```bash
# javascript
$ npx create-next-app [폴더]

# typescript
$ npx create-next-app [폴더] --typescript
```

## 사용

```bash
# 개발
$ npm run dev
# 빌드
$ npm run build
```

## 대표 기능 정리

* 페이지를 만들기 위해서는 `pages` 폴더에 파일을 만들면 되고, 반드시 `default` 로 export 해야 한다.
    + 파일 이름으로 주소가 결정되며 대소문자를 구분한다. (한글은 지원 안함)
    + 예를 들어, `test.tsx` 라는 파일을 만들고 아래와 같이 내용을 적은 다음, http://localhost/test 로 접속하면 페이지가 로드된다.
    ```typescript
    export default function testpage () {
        return <h1>yeah</h1>
    }
    ```
    + 주소를 더 구분하고 싶으면 폴더를 생성해서 그 안에 파일을 만들면 된다(pages > a > b.tsx). http://localhost/a/b 로 접속하면 페이지 내용에 d 가 출력된다.
    ```typescript
    export default function c () {
        return <h1>d</h1>
    }
    ```
    + 페이지 내부에서 다른 페이지로 이동하고 싶은 경우, `Link` component 태그를 이용하여 Client Side 방식으로 이동할 수 있다.
    > `Link` component 태그를 사용할 때는 `<a>` 태그를 감싸도록 wrapping 시켜야 한다.

    > Client Side 방식이라는 것은 JavaScript 만을 이용하여 페이지를 이동한다는 의미이다. `Link` component 태그를 사용했을 때와 `<a>` 태그를 사용했을 때 차이를 보면 알 수 있다. (개발자 도구로 `<html>` 태그의 스타일에 배경색을 넣고 차이를 확인해보면 `Link` component 태그를 사용했을 경우는 배경색이 변하지 않는다. 반면 `<a>` 태그를 사용하면 하얀색 배경이 나타난다.)
    ```typescript
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
    ```
    + `<head>` 태그 말고 `<Head>` component 태그를 지원한다. 동일한 내용을 담는 스크립트가 여러 개가 있으면 중복된 내용은 삭제된다.
* Pre-rendering 방식에 Static Generation, Server Side Rendering (SSR) 을 모두 지원한다. `npm run dev` 상태에서는 SSR 로 동작하며, 개발자는 페이지마다 이 두 가지 방식을 선택할 수 있다.
    + Static Generation - HTML 을 빌드 시에 만들어두고, 요청마다 재사용
        + `getStaticProps`
            + 페이지 생성 시 외부 호출을 통한 조합이 가능
            + 외부 API, DB 접근 용도
            + `pages` 에서 관리되는 컴포넌트에서만 해당 component 를 export  가능
            + **빌드할 때** 처음으로 실행되고, 개발 모드에서는 새로고침할 때마다 실행
        ```typescript
        export async function getStaticProps() {
            const data = {}
            return {
                props: {
                    // props
                }
            }
        }
        ```
        + SWR
            + Static Generation + Client Side 에서 데이터만 호출하는 방식의 React Hook
        ```typescript
        import useSWR from 'swr'

        function testSWR() {
            const { data, error } = useSWR('/api/test', fetch)
        }
        ```
    + Server Side Rendering - 요청마다 HTML 을 생성
        + `getServerSideProps`
            + `context` 파라미터가 있으며 이 안에 `request` 파라미터가 포함됨 (페이지에 따라 다르게 사용하고 싶으면 이 파라미터를 이용할 것)
                + context
                    + params - 페이지 라우트 시 넘어오는 파라미터
                    + req - HTTP Request 객체
                    + res - HTTP Response 객체
                    + query - Query String
                    + preview - 페이지의 Preview 모드 여부
                    + previewData - `setPreviewData` 에 의해 설정된 값
        ```typescript
        // context 파라미터가 있음을 유의
        export async function getServerSideProps(context) {
            return {
                props: {
                    // props
                }
            }
        }
        ```
    + `[`, `]` 을 넣어서 Dynamic Page 를 만들 수 있다. 이름을 `[id].tsx` 로 만들면 Dynamic Route 를 하도록 만들어줄 수 있다.
        + `getStaticProps`, `getStaticPaths`
* 정적 파일들은 `public` 폴더에서 관리한다.
* 스타일 파일들은 `styles` 폴더에서 관리한다.
    + 전역에서 사용할 css 는 `_app` 에서만 사용할 수 있다. (대신 위치나 이름은 자유롭다)
    + scss, sass 를 지원한다.
    + css, scss, sass 파일들의 이름은 반드시 `.module.css` / `.module.scss` 등으로 끝나야 사용할 수 있다.
* API 와 같은 Backend 기능을 만들기 위해서는 반드시 동일 디렉토리 안에 `api` 라는 폴더가 있어야 하고, 그 안에 파일을 만들어서 제작해야 한다. (없으면 `NextApiRequest` 가 제대로 동작하지 않는다)
    + 결과를 출력할 때 기본적으로 **JSON** 형태로 encode 된다.
    + 공식 문서에서는 SSR 방식을 사용할 때 `getStaticProps`, `getStaticPaths` 에서 API Fetch 를 하지 않는 것을 권장하고 있으며 대신 해당 component 를 직접 import 해서 사용하는 것을 권장하고 있다.
    ```
    Do Not Fetch an API Route from getStaticProps or getStaticPaths
    ```
---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
