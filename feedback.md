# Feedback từ khách — Định hướng lại nội dung website Maxxim

Phần này là **yêu cầu thực tế từ khách**

---

## 1. Web này phục vụ ai

Khách hàng của website là **người Việt Nam hoặc người Trung Đông**, có con đi du học bên Anh.

Nhóm khách này muốn **mua bất động sản ở Anh** — họ đang ở VN hoặc Trung Đông nhưng cần sở hữu nhà/căn hộ tại nước Anh (chủ yếu để con cái du học có chỗ ở).

→ Vì vậy website cần **đăng các bất động sản ở thị trường Anh**.

---

## 2. Nhu cầu phát sinh từ con cái của khách

Con cái trong gia đình khách (đang ở Anh) cũng có nhu cầu tìm đến Maxxim để được tư vấn làm Airbnb cho căn hộ đã mua.

Ví dụ khách kể: con họ ở 1 phòng, còn 2 phòng trống → cần Maxxim tư vấn sửa chữa lại để cho thuê / làm Airbnb kiếm thêm thu nhập.

---

## 3. Các dịch vụ Maxxim đang cung cấp (phải show hết trên web)

Khách muốn website thể hiện đầy đủ các dịch vụ hiện tại của công ty:

- **Tư vấn**
- **Sửa chữa**
- **Cho thuê**

---

## 4. Mục tiêu khách đặt ra cho website

Khách muốn: website phải **show hết được các dịch vụ Maxxim đang cung cấp** và làm sao cho những dịch vụ đó **đánh trúng đúng nhóm khách như trên** (gia đình VN / Trung Đông mua BĐS Anh, và con cái họ cần tư vấn sửa chữa - cho thuê).

---
 
# Hiểu về ngành — để dev làm cho đúng

Phần dưới đây giải thích **bối cảnh ngành nghề của Maxxim** để cả team (đặc biệt là dev) hiểu mình đang xây cái gì. Web hiện tại đang bị nhầm là "công ty kiến trúc / xây biệt thự" — KHÔNG phải. Đọc kỹ phần này để hiểu đúng bản chất.

## A. Maxxim thực chất làm nghề gì

Maxxim là **đơn vị dịch vụ bất động sản ở Anh dành cho người mua từ nước ngoài**. Hiểu đơn giản: khách ở VN / Trung Đông không sống ở Anh, không rành thị trường và pháp lý Anh, nên họ cần một đơn vị tại chỗ lo giúp **toàn bộ vòng đời của căn nhà**:

1. Giúp họ **chọn & mua** bất động sản phù hợp ở Anh.
2. Giúp **sửa chữa / cải tạo** căn nhà sau khi mua.
3. Giúp **cho thuê & quản lý** căn nhà để sinh ra thu nhập.

→ Maxxim KHÔNG phải công ty xây dựng khoe công trình. Maxxim là **đối tác lo trọn gói** cho người sở hữu BĐS Anh từ xa.

## B. Tại sao khách cần một đơn vị như Maxxim

Đây là điểm dev cần "thấm" để làm web cho đúng cảm xúc khách:

- Khách bỏ ra số tiền rất lớn để mua nhà **ở một nước họ chưa từng sống**.
- Họ không có mặt tại Anh để đi xem nhà, ký giấy tờ, giám sát sửa chữa, hay quản lý khách thuê.
- Pháp lý, thuế, hợp đồng thuê nhà ở Anh khác hoàn toàn VN → họ dễ bị "ngợp" và sợ bị lừa.

→ Cảm xúc chủ đạo của khách là **lo lắng + cần được tin tưởng**. Vì vậy yếu tố quan trọng nhất của web không phải "ảnh đẹp" mà là **tạo niềm tin** (uy tín, minh bạch, có người lo từ A-Z).

## C. Hành trình của khách (customer journey)

Dev hiểu hành trình này thì mới sắp xếp nội dung đúng logic. Khách đi qua 3 giai đoạn, **gắn đúng với 3 dịch vụ**:

| Giai đoạn | Khách đang ở đâu | Maxxim làm gì (dịch vụ) |
|---|---|---|
| Trước khi mua | Đang tìm hiểu, phân vân chọn nhà nào | **Tư vấn** — chọn BĐS, vùng nào gần trường con học, giá cả, pháp lý mua bán |
| Sau khi mua | Đã sở hữu nhà nhưng chưa ở/cho thuê được | **Sửa chữa** — cải tạo, nội thất để ở hoặc để cho thuê |
| Khi muốn sinh lời | Có phòng trống chưa dùng | **Cho thuê** — cho thuê dài hạn hoặc Airbnb ngắn hạn, quản lý khách thuê |

→ Đây không phải 3 dịch vụ rời rạc, mà là **một chuỗi liên tục** Maxxim đi cùng khách từ lúc chưa mua đến lúc nhà sinh ra tiền.

## D. Các khái niệm trong ngành dev cần biết

Để model dữ liệu và làm UI cho đúng, dev nên hiểu mấy thuật ngữ sau (sẽ xuất hiện nhiều trong nội dung):

- **Bất động sản (property / listing):** một căn nhà/căn hộ đăng trên web. Mỗi căn cần các thông tin: vị trí (thành phố ở Anh, gần trường đại học nào), giá (£ — bảng Anh), số phòng ngủ, số phòng tắm, diện tích, loại hình (căn hộ / nhà), hình ảnh, mô tả.
- **Cho thuê dài hạn (long-term let):** cho thuê theo hợp đồng nhiều tháng/năm, thường cho sinh viên hoặc người đi làm.
- **Cho thuê ngắn hạn / Airbnb (short-term let):** cho thuê theo ngày/tuần như khách sạn. Đây là phần con cái khách quan tâm (phòng trống → cho thuê kiếm thêm).
- **Quản lý cho thuê (property management):** Maxxim đứng ra quản lý hộ — tìm khách, dọn dẹp, sửa vặt, thu tiền — thay cho chủ nhà đang ở xa hoặc đang đi học.
- **Lợi suất / thu nhập cho thuê (rental yield / income):** số tiền căn nhà sinh ra mỗi tháng/năm. Nhà đầu tư rất quan tâm con số này → web nên thể hiện được (ví dụ "phòng trống có thể thu về ~£X/tháng").
- **Sửa chữa / cải tạo (renovation / refurbishment):** làm lại nội thất, sửa sang để căn nhà ở được hoặc cho thuê được giá hơn.

## E. Web này gần với loại nào

Để dev hình dung: đây là sự kết hợp của **2 kiểu web**:

1. **Web đăng tin bất động sản** (giống Rightmove, Zoopla ở Anh) — phần danh sách BĐS có lọc, có trang chi tiết từng căn.
2. **Web giới thiệu dịch vụ** (tư vấn / sửa chữa / cho thuê) — phần thuyết phục khách tin và liên hệ.

KHÔNG phải web portfolio kiến trúc như bản hiện tại.

## F. Lưu ý đặc thù do khách mua từ xa

- Tiền tệ chính là **bảng Anh (£ / GBP)**, vì BĐS ở Anh.
- Khách mua từ xa → mọi thứ liên quan đến **niềm tin và minh bạch** (giấy phép, quy trình, có người tại Anh lo) phải được làm rõ.

---

2 bạn đọc kỹ phần "Hiểu về ngành" để nắm đúng bản chất công việc của Maxxim trước khi bắt tay vào ideal. Có gì chưa rõ về nghiệp vụ thì hỏi mình, mình hỏi lại khách để chốt cho chính xác.

Thanks 2 bạn.
