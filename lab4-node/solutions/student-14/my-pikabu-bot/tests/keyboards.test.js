import { describe, test, expect } from '@jest/globals';
import { categoryKeyboard, frequencyKeyboard, newsCommandKeyboard, newsFilters, sourceKeyboard, createnewsKeyboard } from "../src/utils/keyboards";

describe('Keyboards', () => {
  
  describe('categoryKeyboard - выбор категории новостей', () => {
    
    test('содержит все три основные категории новостей', () => {
      const keyboard = categoryKeyboard.reply_markup.inline_keyboard;
      
      expect(keyboard).toHaveLength(3);
      
      expect(keyboard[0][0].text).toBe('Политика');
      expect(keyboard[0][0].callback_data).toBe('politics');
      
      expect(keyboard[1][0].text).toBe('Экономика');
      expect(keyboard[1][0].callback_data).toBe('economics');
      
      expect(keyboard[2][0].text).toBe('Технологии');
      expect(keyboard[2][0].callback_data).toBe('technologies');
    });

    test('каждая кнопка на отдельной строке', () => {
      const keyboard = categoryKeyboard.reply_markup.inline_keyboard;
      
      keyboard.forEach(row => {
        expect(row).toHaveLength(1);
      });
    });
  });

  describe('frequencyKeyboard - выбор частоты рассылки', () => {
    
    test('содержит все три варианта частоты рассылки', () => {
      const keyboard = frequencyKeyboard.reply_markup.inline_keyboard;
      
      expect(keyboard).toHaveLength(3);
      
      expect(keyboard[0][0].text).toBe('каждый день');
      expect(keyboard[0][0].callback_data).toBe('everyDay');
      
      expect(keyboard[1][0].text).toBe('по понедельникам');
      expect(keyboard[1][0].callback_data).toBe('onMondays');
      
      expect(keyboard[2][0].text).toBe('по выходным');
      expect(keyboard[2][0].callback_data).toBe('onWeekends');
    });

    test('все кнопки на отдельных строках', () => {
      const keyboard = frequencyKeyboard.reply_markup.inline_keyboard;
      
      keyboard.forEach(row => {
        expect(row).toHaveLength(1);
      });
    });
  });

  describe('newsCommandKeyboard - кнопки для команды /news', () => {
    
    test('содержит все команды для /news', () => {
      const keyboard = newsCommandKeyboard.reply_markup.inline_keyboard;
      
      expect(keyboard).toHaveLength(3);
      
      expect(keyboard[0][0].text).toBe('Показать новости');
      expect(keyboard[0][0].callback_data).toBe('show_news');
      
      expect(keyboard[1][0].text).toBe('Выбрать фильтры');
      expect(keyboard[1][0].callback_data).toBe('choose_filters');
      
      expect(keyboard[2][0].text).toBe('Изменить настройки');
      expect(keyboard[2][0].callback_data).toBe('change_settings');
    });

    test('все команды на отдельных строках', () => {
      const keyboard = newsCommandKeyboard.reply_markup.inline_keyboard;
      
      keyboard.forEach(row => {
        expect(row).toHaveLength(1);
      });
    });
  });

  describe('newsFilters - фильтры для новостей', () => {
    
    test('содержит все фильтры для новостей', () => {
      const keyboard = newsFilters.reply_markup.inline_keyboard;
      
      expect(keyboard).toHaveLength(4);
      
      expect(keyboard[0][0].text).toBe('Сначала новые');
      expect(keyboard[0][0].callback_data).toBe('filter_newest');
      
      expect(keyboard[1][0].text).toBe('По релевантности');
      expect(keyboard[1][0].callback_data).toBe('filter_relevant');
      
      expect(keyboard[2][0].text).toBe('За последние 24 часа');
      expect(keyboard[2][0].callback_data).toBe('filter_24h');
      
      expect(keyboard[3][0].text).toBe('Без фильтров');
      expect(keyboard[3][0].callback_data).toBe('filter_none');
    });

    test('каждый фильтр на отдельной строке', () => {
      const keyboard = newsFilters.reply_markup.inline_keyboard;
      
      keyboard.forEach(row => {
        expect(row).toHaveLength(1);
      });
    });
  });

  describe('sourceKeyboard - выбор источников новостей', () => {
    
    test('создает клавиатуру для категории политика с выбранным источником', () => {
      const category = 'политика';
      const selectedSources = ['rambler'];
      
      const keyboard = sourceKeyboard(category, selectedSources);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons).toHaveLength(3);
      
      expect(buttons[0][0].text).toBe('✅ Рамблер');
      expect(buttons[0][0].callback_data).toBe('source_rambler');
      
      expect(buttons[1][0].text).toBe('Ведомости');
      expect(buttons[1][0].callback_data).toBe('source_vedomosti');
      
      expect(buttons[2][0].text).toBe('Завершить выбор источников');
      expect(buttons[2][0].callback_data).toBe('done');
    });

    test('создает клавиатуру для категории экономика с обоими выбранными источниками', () => {
      const category = 'экономика';
      const selectedSources = ['vedomosti', 'investing'];
      
      const keyboard = sourceKeyboard(category, selectedSources);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons).toHaveLength(3);
      
      expect(buttons[0][0].text).toBe('✅ Ведомости');
      expect(buttons[1][0].text).toBe('✅ Investing.com');
    });

    test('создает клавиатуру для категории технологии без выбранных источников', () => {
      const category = 'технологии';
      const selectedSources = [];
      
      const keyboard = sourceKeyboard(category, selectedSources);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons).toHaveLength(3);
      
      expect(buttons[0][0].text).toBe('IXBT');
      expect(buttons[1][0].text).toBe('HABR');
    });

    test('обрабатывает неизвестную категорию', () => {
      const category = 'неизвестная';
      const selectedSources = ['test'];
      
      const keyboard = sourceKeyboard(category, selectedSources);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      // только кнопка завершения для неизвестной категории
      expect(buttons).toHaveLength(1);
      expect(buttons[0][0].text).toBe('Завершить выбор источников');
    });

    test('обрабатывает пустой массив selectedSources по умолчанию', () => {
      const category = 'политика';
      
      const keyboard = sourceKeyboard(category); // без второго параметра
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons).toHaveLength(3);
      expect(buttons[0][0].text).toBe('Рамблер'); 
      expect(buttons[1][0].text).toBe('Ведомости');
    });

    test('правильно отображает галочки для частично выбранных источников', () => {
      const category = 'технологии';
      const selectedSources = ['ixbt']; // только IXBT выбран
      
      const keyboard = sourceKeyboard(category, selectedSources);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons[0][0].text).toBe('✅ IXBT');
      expect(buttons[1][0].text).toBe('HABR'); 
    });

    test('возвращает правильную структуру объекта', () => {
      const category = 'экономика';
      const keyboard = sourceKeyboard(category, []);
      
      expect(keyboard).toHaveProperty('reply_markup');
      expect(keyboard.reply_markup).toHaveProperty('inline_keyboard');
      expect(Array.isArray(keyboard.reply_markup.inline_keyboard)).toBe(true);
    });

    test('обрабатывает категорию с одним источником', () => {
      const category = 'экономика';
      const selectedSources = ['vedomosti'];
      
      const keyboard = sourceKeyboard(category, selectedSources);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons).toHaveLength(3); // 1 источник + кнопка завершения
      expect(buttons[0][0].text).toBe('✅ Ведомости');
      expect(buttons[1][0].text).toBe('Investing.com'); 
    });
  });

  describe('createnewsKeyboard - кнопочки навигации по новостям', () => {
    
    test('создает клавиатуру для первой новости из нескольких', () => {
      const currentIndex = 0;
      const totalNews = 5;
      
      const keyboard = createnewsKeyboard(currentIndex, totalNews);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons).toHaveLength(3);
      
      expect(buttons[0]).toHaveLength(1);
      expect(buttons[0][0].text).toBe('Следующая ➡');
      expect(buttons[0][0].callback_data).toBe('next_news');
      
      expect(buttons[1][0].text).toBe('Выбрать фильтры');
      expect(buttons[1][0].callback_data).toBe('choose_filters');
      
      expect(buttons[2][0].text).toBe('Изменить настройки');
      expect(buttons[2][0].callback_data).toBe('change_settings');
    });

    test('создает клавиатуру для последней новости', () => {
      const currentIndex = 4;
      const totalNews = 5;
      
      const keyboard = createnewsKeyboard(currentIndex, totalNews);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons[0]).toHaveLength(1);
      expect(buttons[0][0].text).toBe('Предыдущая ⬅');
      expect(buttons[0][0].callback_data).toBe('previous_news');
    });

    test('создает клавиатуру для средней новости', () => {
      const currentIndex = 2;
      const totalNews = 5;
      
      const keyboard = createnewsKeyboard(currentIndex, totalNews);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons[0]).toHaveLength(2);
      expect(buttons[0][0].text).toBe('Предыдущая ⬅');
      expect(buttons[0][0].callback_data).toBe('previous_news');
      expect(buttons[0][1].text).toBe('Следующая ➡');
      expect(buttons[0][1].callback_data).toBe('next_news');
    });

    test('создает клавиатуру для единственной новости', () => {
      const currentIndex = 0;
      const totalNews = 1;
      
      const keyboard = createnewsKeyboard(currentIndex, totalNews);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      // единственная новость -> только кнопка "Следующая"
      expect(buttons[0]).toHaveLength(1);
      expect(buttons[0][0].text).toBe('Следующая ➡');
    });

    test('создает клавиатуру для второй новости из двух', () => {
      const currentIndex = 1;
      const totalNews = 2;
      
      const keyboard = createnewsKeyboard(currentIndex, totalNews);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons[0]).toHaveLength(1);
      expect(buttons[0][0].text).toBe('Предыдущая ⬅');
    });

    test('всегда добавляет кнопки фильтров и настроек', () => {
      const testCases = [
        { index: 0, total: 3 },
        { index: 1, total: 3 },
        { index: 2, total: 3 }
      ];
      
      testCases.forEach(({ index, total }) => {
        const keyboard = createnewsKeyboard(index, total);
        const buttons = keyboard.reply_markup.inline_keyboard;
        
        // последние две кнопки всегда одинаковые
        expect(buttons[buttons.length - 2][0].text).toBe('Выбрать фильтры');
        expect(buttons[buttons.length - 1][0].text).toBe('Изменить настройки');
      });
    });

    test('возвращает правильную структуру объекта', () => {
      const keyboard = createnewsKeyboard(0, 3);
      
      expect(keyboard).toHaveProperty('reply_markup');
      expect(keyboard.reply_markup).toHaveProperty('inline_keyboard');
      expect(Array.isArray(keyboard.reply_markup.inline_keyboard)).toBe(true);
    });

    test('обрабатывает граничный случай index = totalNews - 1', () => {
      const keyboard = createnewsKeyboard(4, 5);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons[0][0].text).toBe('Предыдущая ⬅');
    });

    test('обрабатывает случай когда index между первым и последним', () => {
      const keyboard = createnewsKeyboard(1, 3);
      const buttons = keyboard.reply_markup.inline_keyboard;
      
      expect(buttons[0]).toHaveLength(2);
      expect(buttons[0][0].text).toBe('Предыдущая ⬅');
      expect(buttons[0][1].text).toBe('Следующая ➡');
    });

    test('правильно формирует массив кнопок для разных позиций', () => {
      // первая новость
      let keyboard = createnewsKeyboard(0, 3);
      expect(keyboard.reply_markup.inline_keyboard[0]).toHaveLength(1);
      
      // средняя новость
      keyboard = createnewsKeyboard(1, 3);
      expect(keyboard.reply_markup.inline_keyboard[0]).toHaveLength(2);
      
      // последняя новость
      keyboard = createnewsKeyboard(2, 3);
      expect(keyboard.reply_markup.inline_keyboard[0]).toHaveLength(1);
    });
  });
});