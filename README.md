# secret-santa-vk
Бот для игры в Тайного Санту в ВК

Тайный Санта — это весёлая игра, делящая игроков на пары и заставляющая дарить друг друг другу подарки. Бот для игры может быть запущен в любом сообществе по следующей инструкции.

## Как запустить бота?
1. Для начала Вам понадобится создать пустую базу MongoDB. 
Бот создаст в ней базу данных с названием **_santa-claus_** и две коллекции в ней: **_users_** и **_rooms_**.
От этого шага нам понадобится только ссылка на базу данных. Обычно она выглядет так:
_mongodb://[username:password]@[host1][:port1]/[default_db]_

2. Нужно создать Access Token для Бота в ВК. Зайдите в раздел "Управление" своего сообщества и в разделе "Работа с API" нажмите на кнопку "Создать ключ". Полученный в итоге ключ и является Access Token'ом.
Он выглядет примерно так (у Вас могут быть другие буквы и цифры): _e43ef4fe4952dc571s345q17f4c8fc..._

3. Так же потребуется добавить сервер для Webhook'ов. Это так же можно сделать в разделе "Управление" > "Работа с API" > "Callback API". Добавьте туда адрес вашего будущего хостинга и сохраните куда-либо **_Confirmation code_** — он нам понадобится позже

4. Разрешите сообщения от бота в разделе "Управление" > "Сообщения", а так же добавьте кнопку "Начать" в разделе "Настройки для бота"

5. Заливаем содержимое этого репозитория на любой хостинг или VDS, работающий с nodejs. В enviroment для работы бота должны быть прописаны следующие переменные:
- TOKEN (access token)
- CONFIRMATION (confirmation code)
- DATABASE_URL (ссылка для подключения к базе MongoDB)
- PORT (порт, на который бот будет принимать запросы от ВК)

6. При желании, после загрузки файлов на хостинг, в его консоли можно запустить автоматические тесты следующей командой:
<code>npm run test</code>

7. Запускаем бота:
<code>npm run start</code>

8. Заходим обратно в раздел "Управление" своего сообщества, в раздел "Работа с API" > "Callback API". Нажимаем кнопку "Подтвердить" в окне с просьбой о подтверждении адреса. _Теперь бот должен заработать._

## Что может пойти не так?
**Пользователь запретил сообщения от бота**

Что же, тогда бот не сможет написать ему о том, кому ему нужно будет подарить подарок когда комната начнёт игру. К сожалению, с этим ничего не поделаешь и остаётся надеятся на благоразумность пользователя.

Если произойдёт какая-то неожиданная фигня, то логи ошибок хранятся в корне проекта, в файле bot-service.log

---

Если Вы нашли ошибку или у Вас есть предложение для работы бота, то можете открыть issue или написать мне в телеграм: @yinipaka 
