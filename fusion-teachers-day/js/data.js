// Bản nháp nội dung: duyệt và chỉnh lời chúc trước khi công bố chính thức.
// Mỗi bản ghi ứng với đúng một người nhận và một tấm thiệp.
const teachers = [
  {
    id: "teacher-001", name: "Nguyễn Sĩ Thìn", honorific: "Thầy", language: "vi",
    greeting: "Nhân ngày 20/11, chúng em xin gửi đến Thầy lời cảm ơn chân thành. Kính chúc Thầy luôn mạnh khỏe, bình an và có thật nhiều niềm vui trong mỗi ngày."
  },
  {
    id: "teacher-002", name: "Đỗ Trung Anh", honorific: "Thầy", language: "vi",
    greeting: "Cảm ơn Thầy vì sự tận tâm mà chúng em luôn trân quý. Chúc Thầy một ngày Nhà giáo thật ấm áp, nhiều sức khỏe và những điều tốt đẹp phía trước."
  },
  {
    id: "teacher-003", name: "Võ Đức Hoàng", honorific: "Thầy", language: "vi",
    greeting: "Ngày 20/11 là dịp để chúng em nói lời biết ơn đến Thầy. Mong Thầy luôn giữ được niềm vui trong công việc và có thật nhiều khoảnh khắc hạnh phúc bên những người thân yêu."
  },
  {
    id: "teacher-004", name: "Võ Thế Long", honorific: "Thầy", language: "vi",
    greeting: "Chúng em biết ơn Thầy vì những điều tốt đẹp Thầy dành cho sinh viên. Kính chúc Thầy sức khỏe dồi dào, tâm luôn an vui và mỗi chặng đường đều có thêm nguồn cảm hứng mới."
  },
  {
    id: "teacher-005", name: "Phạm Trần Hồng Diễm", honorific: "Cô", language: "vi",
    greeting: "Nhân ngày Nhà giáo Việt Nam, chúng em xin cảm ơn Cô bằng tất cả sự kính mến. Chúc Cô luôn rạng rỡ, khỏe mạnh và đón nhận thật nhiều niềm vui giản dị mỗi ngày."
  },
  {
    id: "teacher-006", name: "Đỗ Thuỳ Như", honorific: "Cô", language: "vi",
    greeting: "Chúng em trân trọng những điều Cô đã dành cho sinh viên và xin gửi lời cảm ơn chân thành. Chúc Cô một mùa 20/11 dịu dàng, nhiều tiếng cười và thật nhiều bình an."
  },
  {
    id: "teacher-007", name: "Bùi Thị Minh Trí", honorific: "Cô", language: "vi",
    greeting: "Cảm ơn Cô vì đã luôn mang đến cho chúng em những điều đáng quý. Kính chúc Cô có một ngày 20/11 trọn vẹn, sức khỏe bền lâu và niềm vui luôn ở bên."
  },
  {
    id: "teacher-008", name: "Lê Hồ Hằng Nguyên", honorific: "Cô", language: "vi",
    greeting: "Chúng em xin gửi đến Cô lời tri ân thật ấm áp trong ngày đặc biệt này. Mong Cô luôn mạnh khỏe, hạnh phúc và tìm thấy những phút giây thư thái giữa nhịp sống bận rộn."
  },
  {
    id: "teacher-009", name: "Lê Nguyễn Đông Trang", honorific: "Cô", language: "vi",
    greeting: "Ngày 20/11, chúng em muốn nói lời cảm ơn Cô một cách thật chân thành. Chúc Cô luôn có sức khỏe, sự an yên và thật nhiều lý do để mỉm cười."
  },
  {
    id: "teacher-010", name: "Mai Thị Kiều Liên", honorific: "Cô", language: "vi",
    greeting: "Chúng em biết ơn Cô và trân trọng những điều Cô trao đi mỗi ngày. Kính chúc Cô một ngày Nhà giáo ngập yêu thương, cùng nhiều niềm vui và thành công trong chặng đường sắp tới."
  },
  {
    id: "teacher-011", name: "Lê Thị Hoá", honorific: "Cô", language: "vi",
    greeting: "Xin cảm ơn Cô vì sự hiện diện đầy ý nghĩa trong hành trình học tập của chúng em. Chúc Cô luôn khỏe mạnh, tươi vui và có một ngày 20/11 thật đẹp."
  },
  {
    id: "teacher-012", name: "Trần Đình Nga", honorific: "Cô", language: "vi",
    greeting: "Nhân ngày 20/11, chúng em gửi tới Cô lòng biết ơn và sự kính trọng. Mong Cô có thật nhiều niềm vui, nhiều sức khỏe và những ngày bình yên bên gia đình."
  },
  {
    id: "teacher-013", name: "Trương Đăng Hiếu", honorific: "Thầy", language: "vi",
    greeting: "Chúng em xin cảm ơn Thầy vì những điều Thầy đã trao gửi cho sinh viên. Chúc Thầy luôn mạnh khỏe, vững bước với điều mình yêu thích và đón một mùa 20/11 thật vui."
  },
  {
    id: "teacher-014", name: "Phan Cường", honorific: "Thầy", language: "vi",
    greeting: "Xin gửi Thầy lời tri ân chân thành nhân ngày Nhà giáo Việt Nam. Chúc Thầy có nhiều sức khỏe, những ngày làm việc đầy hứng khởi và cuộc sống luôn ấm áp."
  },
  {
    id: "teacher-015", name: "Trần Thị Mỹ Quỳnh", honorific: "Cô", language: "vi",
    greeting: "Cảm ơn Cô vì những giá trị tốt đẹp chúng em được đón nhận. Kính chúc Cô luôn bình an, hạnh phúc và có thêm nhiều kỷ niệm đáng nhớ trong ngày 20/11."
  },
  {
    id: "teacher-016", name: "Hồ Thị Kim Huệ", honorific: "Cô", language: "vi",
    greeting: "Chúng em gửi đến Cô lời cảm ơn cùng sự trân trọng sâu sắc. Mong Cô luôn dồi dào sức khỏe, giữ nụ cười trên môi và tận hưởng thật nhiều điều dễ thương trong cuộc sống."
  },
  {
    id: "teacher-017", name: "Ian Michael Biggar", honorific: "Mr.", language: "en",
    greeting: "Thank you, Mr. Biggar, for the care and dedication you share with students. Wishing you a joyful Teachers' Day, good health, and many bright moments ahead."
  },
  {
    id: "teacher-018", name: "Joseph Wallace Wisham III", honorific: "Mr.", language: "en",
    greeting: "Mr. Wisham, please accept our sincere gratitude on Teachers' Day. May this special day bring you happiness, and may the year ahead be filled with good health and rewarding moments."
  },
  {
    id: "teacher-019", name: "Trần Băng Huyền", honorific: "Cô", language: "vi",
    greeting: "Nhân ngày 20/11, chúng em xin gửi lời cảm ơn tới Cô từ tận lòng mình. Chúc Cô luôn khỏe mạnh, có nhiều ngày vui và được bao quanh bởi những điều ấm áp."
  },
  {
    id: "teacher-020", name: "Trần Đức Hùng", honorific: "Thầy", language: "vi",
    greeting: "Chúng em trân quý Thầy và xin cảm ơn Thầy trong dịp đặc biệt này. Kính chúc Thầy thật nhiều sức khỏe, sự bình yên và niềm vui trên mỗi hành trình."
  },
  {
    id: "teacher-021", name: "Trần Lê Anh Minh", honorific: "Thầy", language: "vi",
    greeting: "Cảm ơn Thầy vì những điều ý nghĩa Thầy dành cho sinh viên. Chúc Thầy một ngày Nhà giáo tràn đầy niềm vui, cùng sức khỏe và nhiều thành công trong thời gian tới."
  },
  {
    id: "teacher-022", name: "Nguyễn Thị Tỉnh", honorific: "Cô", language: "vi",
    greeting: "Chúng em xin gửi đến Cô lời biết ơn chân thành nhân ngày 20/11. Mong Cô luôn an vui, khỏe mạnh và có thật nhiều thời gian cho những điều mình yêu quý."
  },
  {
    id: "teacher-023", name: "Đào Vĩnh Phúc", honorific: "Thầy", language: "vi",
    greeting: "Nhân ngày Nhà giáo Việt Nam, chúng em cảm ơn Thầy vì sự quan tâm dành cho sinh viên. Chúc Thầy luôn khỏe, luôn vui và đón thêm nhiều điều tốt lành trong cuộc sống."
  },
  {
    id: "teacher-024", name: "Nguyễn Thành Long", honorific: "Thầy", language: "vi",
    greeting: "Chúng em gửi đến Thầy lời tri ân giản dị mà chân thành trong ngày 20/11. Kính chúc Thầy nhiều sức khỏe, niềm vui bền lâu và một chặng đường phía trước thật nhiều cảm hứng."
  }
];
