'use strict'

function addSpringMode() {
    function toggleSpringMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            const currentBg = pageWrapper.style.backgroundColor;

            if (currentBg === 'rgb(186, 207, 165)' || currentBg === '#bacfa5ff' || currentBg === 'rgba(218, 255, 181, 1)') {
                removeSpringStyles();
                localStorage.setItem('springModeEnabled', 'false');
            } else {
                applySpringStyles();
                localStorage.setItem('springModeEnabled', 'true');
            }
        } else {
            console.log('Элемент с id="page_wrapper" не найден');
        }
    }

    function applySpringStyles() {
        const pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            pageWrapper.style.backgroundColor = '#bacfa5ff'; 
            pageWrapper.style.color = '#365100ff'; 
            pageWrapper.style.fontFamily = 'Palatino Linotype';
            pageWrapper.style.fontWeight = '200px';
            pageWrapper.style.padding = '10px';
        }

        const newsBox = document.querySelector('.news_box');
        if (newsBox) {
            newsBox.style.backgroundColor = '#cfa5c6ff'; 
            newsBox.style.border = '2px solid #cd67b7ff'; 
            newsBox.style.borderRadius = '5px';
        }

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.backgroundColor = '#b0edaeff'; 
            mainContent.style.padding = '10px';
            mainContent.style.margin = '10px';
        }

        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.backgroundColor = '#466443ff'; 
            footer.style.color = '#152c13ff';
        }

        if (mainContent) {
            const contentParent = mainContent.parentElement;
            if (contentParent && contentParent.children) {
                for (let child of contentParent.children) {
                    if (child.tagName === 'DIV') {
                        child.style.backgroundColor = '#bacfa5ff';
                    }
                }
            }
        }

        const navItems = document.querySelectorAll('.menu-list');
        navItems.forEach(item => {
            item.style.backgroundColor = '#b869a7ff';
        });

        const buttons = document.querySelectorAll('button, .btn, .kai-btn-block');
        buttons.forEach(button => {
            button.style.backgroundColor = '#fffbbfff';
            button.style.color = '#988100ff';
            button.style.border = '2px solid #cab447ff'; 
            button.style.borderRadius = '10px';
            button.style.padding = '5px';
            button.style.margin = '3px';
        });

        updateButtonText();
    }

    function removeSpringStyles() {
        const elements = [
            document.getElementById('page_wrapper'),
            document.querySelector('.main_slider_holder'),
            document.querySelector('.news_box'),
            document.getElementById('main-content'),
            document.getElementById('content'),
            document.querySelector('footer'),
        ];

        elements.forEach(element => {
            if (element) element.style.cssText = '';
        });

        const navItems = document.querySelectorAll('.menu-list');
        if (navItems.length > 0) {
            navItems.forEach(item => {
                item.style.cssText = '';
            });
        }

        const buttons = document.querySelectorAll('button, .btn, .kai-btn-block');
        if (buttons.length > 0) {
            buttons.forEach(button => {
                button.style.cssText = '';
            });
        }

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const contentParent = mainContent.parentElement;
            if (contentParent && contentParent.children) {
                for (let child of contentParent.children) {
                    if (child.tagName === 'DIV') {
                        child.style.cssText = '';
                    }
                }
            }
        }

        updateButtonText();
    }

    function updateButtonText() {
        const button = document.getElementById('spring-toggle-btn');
        if (button) {
            const isEnabled = localStorage.getItem('springModeEnabled') === 'true';
            button.textContent = isEnabled ? '🌸SPRING ON' : '🌸SPRING OFF';
            button.style.backgroundColor = isEnabled ? '#8bcc98ff' : '#ffffffff';
        }
    }

    function createToggleButton() {
        if (document.getElementById('spring-toggle-btn')) {
            return;
        }

        let buttonContainer = document.querySelector('.box_links');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            document.body.appendChild(buttonContainer);
        }

        const button = document.createElement('div');
        button.id = 'spring-toggle-btn';
        const isEnabled = localStorage.getItem('springModeEnabled') === 'true';
        button.textContent = isEnabled ? '🌸SPRING ON' : '🌸SPRING OFF';
        button.title = 'Переключить весенний режим';

        Object.assign(button.style, {
            width: '130px',
            height: '30px',
            border: 'none',
            backgroundColor: '#ffffffff',
            color: '#8c3f73ff',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            float: 'left',    
            margin: '0 0 0 6px',
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', toggleSpringMode);
        buttonContainer.appendChild(button);

        if (isEnabled) {
            setTimeout(applySpringStyles, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addSpringMode();