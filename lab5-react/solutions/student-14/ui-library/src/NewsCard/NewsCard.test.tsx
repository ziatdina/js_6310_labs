import { render, screen, fireEvent } from '@testing-library/react'

import { NewsCard } from './NewsCard'

const mockProps = {
  profPhoto: 'ава.jpg',
  author: 'Тестовый Автор',
  date: new Date('2024-01-01T12:00:00'),
  content: 'Здесь тестовый контент '.repeat(100),
  pictures: ['test1.jpg', 'test2.jpg'],
  likes: 42,
  isLike: false,
  isExpanded: false,
  onToggle: jest.fn(),
  onLikeToggle: jest.fn(),
}

describe('NewsCard', () => {
  test('рендерит базовую информацию корректно', () => {
    render(<NewsCard {...mockProps} />)

    const avatar = screen.getByAltText('аватарка')

    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'ава.jpg')

    expect(screen.getByText('Тестовый Автор')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    
    const image = screen.getByAltText('фото 1')

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'test1.jpg')
    
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument()
  })

  test('вызывает onToggle при клике на карточку', () => {
    const mockOnToggle = jest.fn()
    
    render(<NewsCard {...mockProps} onToggle={mockOnToggle} />)

    const newsSection = screen.getByText(/Здесь тестовый контент/).closest('div')

    fireEvent.click(newsSection!)

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  test('вызывает onLikeToggle при клике на лайк', () => {
    const mockOnLikeToggle = jest.fn()
    
    render(<NewsCard {...mockProps} onLikeToggle={mockOnLikeToggle} />)

    const likeButton = screen.getByText('🩶')

    fireEvent.click(likeButton)

    expect(mockOnLikeToggle).toHaveBeenCalledTimes(1)
  })

  test('отображает полный текст когда isExpanded = true', () => {
    const expandedProps = {
      ...mockProps,
      isExpanded: true,
    }

    render(<NewsCard {...expandedProps} />)

    const content = screen.getByText(/Здесь тестовый контент/)

    expect(content).not.toHaveTextContent(/\.\.\.$/)
  })

  test('отображает все картинки когда isExpanded = true', () => {
    const expandedProps = {
      ...mockProps,
      isExpanded: true,
    }

    render(<NewsCard {...expandedProps} />)

    const image1 = screen.getByAltText('Фото 0')
    const image2 = screen.getByAltText('Фото 1')
    
    expect(image1).toBeInTheDocument()
    expect(image2).toBeInTheDocument()
    expect(image1).toHaveAttribute('src', 'test1.jpg')
    expect(image2).toHaveAttribute('src', 'test2.jpg')
  })

  test('отображает красное сердечко когда isLike = true', () => {
    const likedProps = {
      ...mockProps,
      isLike: true,
    }

    render(<NewsCard {...likedProps} />)

    expect(screen.getByText('❤️')).toBeInTheDocument()
    expect(screen.queryByText('🩶')).not.toBeInTheDocument()
  })

  test('не ломается когда onToggle и onLikeToggle не переданы', () => {
    const propsWithoutCallbacks = {
      ...mockProps,
      onToggle: undefined,
      onLikeToggle: undefined,
    }

    // Не должно быть ошибок
    expect(() => {
      render(<NewsCard {...propsWithoutCallbacks} />)
    }).not.toThrow()

    // Клики не должны падать
    const newsSection = screen.getByText(/Здесь тестовый контент/).closest('div')
    const likeButton = screen.getByText('🩶')
    
    expect(() => {
      fireEvent.click(newsSection!)
      fireEvent.click(likeButton)
    }).not.toThrow()
  })
})