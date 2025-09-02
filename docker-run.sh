#!/bin/bash

# Скрипт для запуска Docker контейнеров

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "Файл .env не найден. Создаю из env.example..."
    cp env.example .env
    echo "Пожалуйста, отредактируйте .env файл с вашими настройками"
    exit 1
fi

# Функция для показа справки
show_help() {
    echo "Использование: $0 [команда]"
    echo ""
    echo "Команды:"
    echo "  build     - Собрать образ"
    echo "  up        - Запустить контейнеры"
    echo "  down      - Остановить контейнеры"
    echo "  restart   - Перезапустить контейнеры"
    echo "  logs      - Показать логи"
    echo "  shell     - Войти в контейнер"
    echo "  dev       - Запустить в режиме разработки"
    echo "  help      - Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  $0 build && $0 up"
    echo "  $0 dev"
}

# Основная логика
case "$1" in
    build)
        echo "Собираю Docker образ..."
        docker-compose build
        ;;
    up)
        echo "Запускаю контейнеры..."
        docker-compose up -d
        echo "Приложение доступно по адресу: http://localhost:3000"
        ;;
    down)
        echo "Останавливаю контейнеры..."
        docker-compose down
        ;;
    restart)
        echo "Перезапускаю контейнеры..."
        docker-compose restart
        ;;
    logs)
        docker-compose logs -f
        ;;
    shell)
        echo "Вхожу в контейнер..."
        docker-compose exec frontend sh
        ;;
    dev)
        echo "Запускаю в режиме разработки..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        echo "Dev сервер доступен по адресу: http://localhost:3001"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Неизвестная команда: $1"
        echo "Используйте '$0 help' для справки"
        exit 1
        ;;
esac
