import { useState } from 'react'

import '@my-app/ui-library/style.css'
import { NewsCard } from '@my-app/ui-library'
import './App.css'

const App = () => {
  const [ isExpanded, setIsExpanded ] = useState(false)
  const [ isLike, setIsLike ] = useState(false)
  const [ likesCount, setLikesCount ] = useState(0)

  const handleToggle = () => {
    setIsExpanded(!isExpanded) 
  }

  const handleLikeToggle = () => {
    setIsLike(!isLike)
    const prev = likesCount

    setLikesCount(isLike ? prev - 1 : prev + 1)
  }

  const news = {
    profPhoto: "https://www.rospensioner.ru/wp-content/uploads/2023/11/ria-logo.png",
    author: "РИА Новости",
    date: new Date(),
    content: ('Живущее в Ленинградском зоопарке семейство редких угольных черепах, где самец носит имя Микеланджело, '
                 + 'а самка – Памела, во второй раз стало родителями, у них вылупились три черепашонка, сообщил в понедельник зоопарк. '
                 + '\n"Угольные черепахи Микеланджело и Памела второй раз стали родителями... Кладку черепахи сделали в конце февраля. '
                 + 'Вскоре яйца поместили в инкубатор, где создали условия для благополучного развития малышей. '
                 + 'В августе на свет появились три очаровательных черепашонка, каждый размером со сливу", – говорится в Telegram-канале учреждения." '
                 + '\n\nКак отмечается, к двум годам размер черепах увеличится втрое и составит около 20 сантиметров. '
                 + 'В неволе этот вид рептилий, который находится под угрозой исчезновения, живет около 60 лет. '
                 + '\n\nВ зоопарке добавили, что маленькие угольные черепашки с удовольствием пробуют растительную и животную пищу. '
                 + 'Особенно они любят творог, креветки, грибы и яйца.\n\nВ настоящее время малыши живут во внутренних помещениях, '
                 + 'а их родители делят вольер с зелеными игуанами в павильоне "Экзотариум".\n\n').repeat(3),
    pictures: ["https://avatars.mds.yandex.net/i?id=e8dc8f51a5c1f525531bb5c67e33a3678aedfb2f-4809805-images-thumbs&n=13", "https://avatars.mds.yandex.net/i?id=97aa0305a187acec6c204fb03d2d23ce92ae6e6e-8174067-images-thumbs&n=13"],
    likes: 0,
    isLike: false,
    isExpanded: false,

  }

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>5 лаба</h1>
        <p>Разработка компонента новостной карточки</p>
      </header>
      <main className='app-main'>
        <section className='newsCard-section'>
          <h2>Компонент NewsCard</h2>
          <NewsCard
            profPhoto={news.profPhoto}
            author={news.author}
            date={news.date}
            content={news.content}
            pictures={news.pictures}
            likes={likesCount}
            isLike={isLike}
            isExpanded={isExpanded}
            onToggle={handleToggle}
            onLikeToggle={handleLikeToggle}
          ></NewsCard>
        </section>
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <p>UI Library v1.0.0 - Демонстрационное приложение</p>
          <p>React + TypeScript + Vite + Jest</p>
        </div>
      </footer>
    </div>
  )
}

export default App