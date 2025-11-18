import styles from './NewsCard.module.css'

export interface NewsCardProps {
    profPhoto: string
    author: string
    date: Date
    content: string
    pictures: string[]
    likes: number
    isLike: boolean
    isExpanded: boolean
    onToggle?: () => void
    onLikeToggle?: () => void
}

export const NewsCard = (props: NewsCardProps) => {
  const { profPhoto, author, date, content, pictures, likes, isLike, isExpanded, onToggle, onLikeToggle } = props

  return (
    <div className={styles.newsCard}>
      <div className={styles.authorSection}>
        { profPhoto && <img src={profPhoto} alt="аватарка"></img> }
        <div className={styles.authorText}>
          <span>{author}</span>
          <p>{date.toLocaleString()}</p>
        </div>
      </div>
      <div className={styles.newsSection} onClick={onToggle}>
        <p>
          {isExpanded ? content : (content.slice(0,2000) + '...')}
        </p>
        { pictures.length > 0 && (
          isExpanded ? pictures.map((photo, index) => (
            <img key={index} src={photo} alt={`Фото ${index}`} ></img>
          )) : <img src={pictures[0]} alt="фото 1"></img> )
        }
      </div>
      <div className={styles.likeSection}>
        <span>{likes}</span>
        <span onClick={onLikeToggle}>{isLike? '❤️' : '🩶'}</span>
      </div>
    </div>
  )
}