# 🚀 ZenStyle

Mô tả ngắn gọn về dự án của bạn tại đây. (Ví dụ: Hệ thống quản lý bán hàng tích hợp thanh toán trực tuyến được xây dựng trên nền tảng Laravel 11).

## 🛠️ Công nghệ sử dụng

- **Framework:** Laravel 11.x
- **Database:** MySQL
- **PHP Version:** >= 8.2
- **Các thư viện chính:** Carbon, Sanctum, Cloudinary

## 💻 Hướng dẫn cài đặt dưới Local

Để chạy dự án này trên máy cá nhân, hãy thực hiện theo các bước sau:

### 1. Clone dự án

```bash
git clone https://github.com/tinwok/aptech-semester-1
cd back-end
```

### 2. Cài đặt các thư viện (Dependencies)

```bash
composer install
npm install && npm run dev
```

### 3. Cấu hình môi trường Environment

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Mở file `.env` ra và cấu hình lại thông tin Database của bạn (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

### 4. Tạo App Key

```bash
php artisan key:generate
```

### 5. Chạy Migration và Seed dữ liệu mẫu

````bash
php artisan migrate --seed
# có thêm phần seeder cho admin

### 6. Khởi chạy Server dự án

```bash
php artisan serve
````

Bây giờ bạn có thể truy cập dự án tại địa chỉ: `http://127.0.0.1:8000`

## ⏰ Cấu hình tác vụ tự động (Cron Job trên Production)

Dự án này có sử dụng Task Scheduling. Khi đưa lên server thực tế, hãy thêm dòng sau vào `crontab -e`:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## 👥 Thành viên phát triển

- **Nguyễn Trung Tín** - _Developer chính_ - [GitHub của bạn](https://github.com/tinwok/aptech-semester-1)
- **Nguyễn Trung Tín**
- **Nguyễn Trung Tín**
- **Nguyễn Trung Tín**
- **Nguyễn Trung Tín**
