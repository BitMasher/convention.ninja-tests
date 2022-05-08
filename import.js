import fetch from "node-fetch";

const data = [{barcode: 'SJ0001', category: 'Console', manufacturer: 'Sony', model: 'Playstation 3'},
    {barcode: 'SJ0002', category: 'Console', manufacturer: 'Microsoft', model: 'Xbox 360 120GB'},
    {barcode: 'SJ0003', category: 'Peripheral', manufacturer: 'Microsoft', model: 'Kinect'},
    {barcode: 'SJ0011', category: 'Laptop', manufacturer: 'HP', model: 'HP G7 Series'},
    {barcode: 'SJ0027', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0028', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0031', category: 'Display', manufacturer: 'Sharp', model: 'Sharp 19" DVD LCD monitor'},
    {
        barcode: 'SJ0052',
        category: 'Surge Protector',
        manufacturer: 'Bayco',
        model: 'Bayco 4 Outlet 25\' Surge Protector'
    },
    {barcode: 'SJ0062', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0063', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0064', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0065', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0066', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0067', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0094', category: 'Console', manufacturer: 'Nintendo', model: 'Wii'},
    {barcode: 'SJ0098', category: 'DVD Player', manufacturer: 'Memorex', model: 'Memorex progressive scan DVD player'},
    {barcode: 'SJ0110', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0118', category: 'Microphone', manufacturer: 'Sennheiser', model: 'Sennheiser wireless microphone'},
    {barcode: 'SJ0119', category: 'Microphone', manufacturer: 'Sennheiser', model: 'Sennheiser microphone receiver'},
    {barcode: 'SJ0123', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0128', category: 'Microwave', manufacturer: 'Haier', model: 'Haier 700 watt microwave'},
    {barcode: 'SJ0131', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0132', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0133', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0134', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0135', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Projector Stand'},
    {barcode: 'SJ0162', category: 'Surge Protector', manufacturer: 'Unsorted', model: '10 outlet surge protector'},
    {barcode: 'SJ0165', category: 'Surge Protector', manufacturer: 'Unsorted', model: '10 outlet surge protector'},
    {barcode: 'SJ0168', category: 'Surge Protector', manufacturer: 'Rhino', model: 'Rhino 12 outlet surge protector'},
    {barcode: 'SJ0169', category: 'Surge Protector', manufacturer: 'Rhino', model: 'Rhino 12 outlet surge protector'},
    {barcode: 'SJ0170', category: 'Projector Screen', manufacturer: 'Unsorted', model: '100" pop-up screen'},
    {barcode: 'SJ0171', category: 'Projector Screen', manufacturer: 'Unsorted', model: '100" pop-up screen'},
    {barcode: 'SJ0172', category: 'Projector Screen', manufacturer: 'Unsorted', model: '120" tripod screen'},
    {barcode: 'SJ0174', category: 'Projector Screen', manufacturer: 'Unsorted', model: '120" tripod screen'},
    {barcode: 'SJ0179', category: 'Projector Screen', manufacturer: 'Favi', model: 'Favi 90" screen'},
    {barcode: 'SJ0180', category: 'Audio', manufacturer: 'AN-Mini', model: 'MiniVox Anchor microphone'},
    {barcode: 'SJ0184', category: 'Printer', manufacturer: 'HP', model: 'HP laserjet 1320 printer'},
    {barcode: 'SJ0188', category: 'Megaphone', manufacturer: 'Groove', model: 'Megaphone'},
    {barcode: 'SJ0190', category: 'Printer', manufacturer: 'HP', model: 'HP laserjet 1018 printer'},
    {barcode: 'SJ0193', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox'},
    {barcode: 'SJ0194', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox, combination lock'},
    {barcode: 'SJ0195', category: 'Microphone', manufacturer: 'Shure', model: 'Shure microphone receiver'},
    {barcode: 'SJ0197', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox'},
    {barcode: 'SJ0198', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox'},
    {barcode: 'SJ0203', category: 'Megaphone', manufacturer: 'Groove', model: 'Megaphone'},
    {barcode: 'SJ0205', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox'},
    {barcode: 'SJ0207', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox, combination lock'},
    {barcode: 'SJ0208', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox, combination lock'},
    {barcode: 'SJ0209', category: 'Microphone', manufacturer: 'Shure', model: 'Shure wireless microphone'},
    {barcode: 'SJ0211', category: 'Microphone Asset', manufacturer: 'Shure', model: 'Shure microphone case'},
    {barcode: 'SJ0212', category: 'Microphone', manufacturer: 'Shure', model: 'Wireless Microphone'},
    {barcode: 'SJ0213', category: 'Microphone', manufacturer: 'Shure', model: 'Wireless Microphone Receiver'},
    {barcode: 'SJ0214', category: 'Microphone Asset', manufacturer: 'Shure', model: 'Shure microphone case'},
    {barcode: 'SJ0215', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Safe'},
    {barcode: 'SJ0218', category: 'Monetary Supplies', manufacturer: 'Sentry Safe', model: 'Lockbox, key lock'},
    {barcode: 'SJ0222', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Bill counter'},
    {barcode: 'SJ0228', category: 'Game', manufacturer: 'Harmonix', model: 'Rock Band'},
    {barcode: 'SJ0240', category: 'Console', manufacturer: 'Nintendo', model: 'Wii'},
    {barcode: 'SJ0244', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0245', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero turntable'},
    {barcode: 'SJ0246', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero turntable'},
    {barcode: 'SJ0253', category: 'Microphone', manufacturer: 'Shure', model: 'Shure wired microphone'},
    {barcode: 'SJ0254', category: 'Microphone', manufacturer: 'Shure', model: 'Shure wired microphone'},
    {barcode: 'SJ0255', category: 'Microphone', manufacturer: 'Shure', model: 'Shure wired microphone'},
    {barcode: 'SJ0256', category: 'Microphone', manufacturer: 'Sennheiser', model: 'Sennheiser wired microphone'},
    {barcode: 'SJ0257', category: 'Microphone', manufacturer: 'Sennheiser', model: 'Sennheiser wired microphone'},
    {barcode: 'SJ0258', category: 'Audio', manufacturer: 'Eurorack', model: 'Eurorack 6-channel mixer'},
    {barcode: 'SJ0261', category: 'Projector Screen', manufacturer: 'Unsorted', model: '10\' x 17\' screen'},
    {barcode: 'SJ0267', category: 'Console', manufacturer: 'Microsoft', model: 'Xbox 360'},
    {barcode: 'SJ0268', category: 'Console', manufacturer: 'Nintendo', model: 'Wii + Motion Plus'},
    {barcode: 'SJ0279', category: 'Audio', manufacturer: 'Lenovo', model: 'Lenovo karaoke machine'},
    {barcode: 'SJ0286', category: 'Projector', manufacturer: 'BenQ', model: 'BenQ MS-513'},
    {barcode: 'SJ0296', category: 'Console', manufacturer: 'Sony', model: 'Playstation 3'},
    {barcode: 'SJ0298', category: 'Display', manufacturer: 'Vizio', model: 'Vizio 22" LCD monitor'},
    {barcode: 'SJ0299', category: 'Display', manufacturer: 'Toshiba', model: 'Toshiba 40" LCD monitor'},
    {barcode: 'SJ0300', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero controller'},
    {barcode: 'SJ0301', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero controller'},
    {barcode: 'SJ0303', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero turntable'},
    {barcode: 'SJ0304', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero turntable'},
    {barcode: 'SJ0305', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero microphone'},
    {barcode: 'SJ0306', category: 'Printer', manufacturer: 'HP', model: 'HP laserjet 1018 printer'},
    {barcode: 'SJ0310', category: 'DVD Player', manufacturer: 'Digix', model: 'Digix Blu-Ray player'},
    {barcode: 'SJ0312', category: 'Laptop', manufacturer: 'Asus', model: 'Asus X4104'},
    {barcode: 'SJ0320', category: 'Laptop', manufacturer: 'Dell', model: 'Dell Latitude D600'},
    {barcode: 'SJ0327', category: 'Projector', manufacturer: 'NEC', model: 'NEC NP-V260X'},
    {barcode: 'SJ0328', category: 'Projector', manufacturer: 'NEC', model: 'NEC NP-V260X'},
    {barcode: 'SJ0336', category: 'Console', manufacturer: 'Sony', model: 'Playstation 2'},
    {barcode: 'SJ0358', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ0360', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ0362', category: 'Console', manufacturer: 'Sony', model: 'PS4'},
    {barcode: 'SJ0363', category: 'Megaphone', manufacturer: 'Groove', model: 'Megaphone'},
    {barcode: 'SJ0364', category: 'Laptop', manufacturer: 'Unsorted', model: 'Square Stand'},
    {barcode: 'SJ0365', category: 'Console', manufacturer: 'Nintendon', model: 'Wii U'},
    {barcode: 'SJ0366', category: 'Display', manufacturer: 'BenQ', model: 'Ben Q 22 Inch'},
    {barcode: 'SJ0367', category: 'Display', manufacturer: 'BenQ', model: 'Ben Q 22 Inch'},
    {barcode: 'SJ0369', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0370', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0373', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ0374', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ0375', category: 'Controller', manufacturer: 'Playstation', model: 'Miku Controler'},
    {barcode: 'SJ0376', category: 'Console', manufacturer: 'Sony', model: 'PS Classic'},
    {barcode: 'SJ0377', category: 'TV', manufacturer: 'Polaroid', model: '32 inch Polaroid'},
    {barcode: 'SJ0378', category: 'Laptop', manufacturer: 'Unsorted', model: 'Square Stand'},
    {barcode: 'SJ0380', category: 'Display', manufacturer: 'Asus', model: 'ASUS Monitor'},
    {barcode: 'SJ0381', category: 'Display', manufacturer: 'BenQ', model: 'Ben Q 22 Inch'},
    {barcode: 'SJ0382', category: 'Projector', manufacturer: 'Unsorted', model: 'Projector Screen'},
    {barcode: 'SJ0383', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0384', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0387', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ0389', category: 'Console', manufacturer: 'Sony', model: 'PS4'},
    {barcode: 'SJ0390', category: 'Monitor', manufacturer: 'Acer', model: 'Acer Screen'},
    {barcode: 'SJ0391', category: 'Projector', manufacturer: 'ViewSonic', model: 'ViewSonic'},
    {barcode: 'SJ0392', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0393', category: 'Console', manufacturer: 'Sony', model: 'PS4'},
    {barcode: 'SJ0394', category: 'Display', manufacturer: 'BenQ', model: 'Ben Q 22 Inch'},
    {barcode: 'SJ0395', category: 'Display', manufacturer: 'Asus', model: 'ASUS Monitor'},
    {barcode: 'SJ0396', category: 'Audio', manufacturer: 'Unsorted', model: 'Fender Passport PA'},
    {barcode: 'SJ0397', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0399', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0401', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ0403', category: 'Console', manufacturer: 'Sony', model: 'PS4'},
    {barcode: 'SJ0404', category: 'PA System', manufacturer: 'EON', model: 'EON PA'},
    {barcode: 'SJ0405', category: 'Projector', manufacturer: 'Epson', model: 'Ultra Short Projector'},
    {barcode: 'SJ0407', category: 'Display', manufacturer: 'Asus', model: 'ASUS Monitor'},
    {barcode: 'SJ0408', category: 'Display', manufacturer: 'Asus', model: 'ASUS Monitor'},
    {barcode: 'SJ0409', category: 'Laptop', manufacturer: 'Unsorted', model: 'iPad Air'},
    {barcode: 'SJ0410', category: 'Laptop', manufacturer: 'Unsorted', model: 'iPad Air'},
    {barcode: 'SJ0411', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0412', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0414', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ0415', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ0417', category: 'PA System', manufacturer: 'Yamaha', model: 'PA System'},
    {barcode: 'SJ0418', category: 'PA System', manufacturer: 'Yamaha', model: 'PA System'},
    {barcode: 'SJ0419', category: 'Projector', manufacturer: 'ViewSonic', model: 'Short Throw Projector'},
    {barcode: 'SJ0422', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0423', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0444', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0445', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0495', category: 'Console', manufacturer: 'Nintendo', model: 'Wii'},
    {barcode: 'SJ0499', category: 'DVD Player', manufacturer: 'Panasonic', model: 'BD Player DMP-BD903P-K'},
    {barcode: 'SJ0500', category: 'Projector', manufacturer: 'NEC', model: 'NEC NP-VE303X'},
    {barcode: 'SJ0501', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox, combination lock'},
    {barcode: 'SJ0503', category: 'TV', manufacturer: 'Hi Sense', model: 'Hi Sence TV'},
    {barcode: 'SJ0504', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0509', category: 'Controller', manufacturer: 'Sony', model: 'PS4 Controller'},
    {barcode: 'SJ0513', category: 'Microphone', manufacturer: 'AKG', model: 'AKG Microphone'},
    {barcode: 'SJ0514', category: 'Projector', manufacturer: 'NEC', model: 'NEC NP-VE303X'},
    {barcode: 'SJ0515', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox, combination lock'},
    {barcode: 'SJ0517', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0518', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0522', category: 'TV', manufacturer: 'Unsorted', model: 'Sharp Aquos'},
    {barcode: 'SJ0527', category: 'Laptop', manufacturer: 'Acer', model: 'Chromebook'},
    {barcode: 'SJ0528', category: 'Projector', manufacturer: 'NEC', model: 'NEC NP-VE303X'},
    {barcode: 'SJ0529', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Lockbox, combination lock'},
    {barcode: 'SJ0532', category: 'DVD Player', manufacturer: 'Sony', model: 'BD Player BDP-S3500'},
    {barcode: 'SJ0536', category: 'Console', manufacturer: 'Sony', model: 'PS3'},
    {barcode: 'SJ0540', category: 'Controller', manufacturer: 'Sony', model: 'Playstation 4 Controller'},
    {barcode: 'SJ0541', category: 'Laptop', manufacturer: 'Acer', model: 'Acer Chromebook'},
    {barcode: 'SJ0545', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0546', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0551', category: 'Console', manufacturer: 'Microsoft', model: 'Xbox 360'},
    {barcode: 'SJ0554', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0555', category: 'Laptop', manufacturer: 'Acer', model: 'Acer Chromebook'},
    {barcode: 'SJ0558', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo Ideapad'},
    {barcode: 'SJ0559', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic 820 powered mixer'},
    {barcode: 'SJ0560', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic 410 powered mixer'},
    {barcode: 'SJ0562', category: 'Microphone', manufacturer: 'DRV', model: 'DRV100 microphone'},
    {barcode: 'SJ0563', category: 'Microphone', manufacturer: 'Phonic', model: 'Phonic DM 680 microphone'},
    {barcode: 'SJ0575', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0581', category: 'Monetary Supplies', manufacturer: 'Sentry Safe', model: 'Money box'},
    {barcode: 'SJ0583', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0584', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0586', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo G570'},
    {barcode: 'SJ0593', category: 'DVD Player', manufacturer: 'Memorex', model: 'Memorex DVD player0'},
    {barcode: 'SJ0601', category: 'Console', manufacturer: 'Microsoft', model: 'Xbox 360 120GB'},
    {barcode: 'SJ0603', category: 'DVD Player', manufacturer: 'Memorex', model: 'Memorex DVD player0'},
    {barcode: 'SJ0606', category: 'Microphone', manufacturer: 'Phonic', model: 'Phonic DM 680 microphone'},
    {barcode: 'SJ0607', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0612', category: 'Speaker', manufacturer: 'Yamaha', model: 'Speaker'},
    {barcode: 'SJ0613', category: 'Speaker', manufacturer: 'Yamaha', model: 'Speaker'},
    {barcode: 'SJ0617', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0627', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0631', category: 'Controller', manufacturer: 'Sony', model: 'Miku Controller'},
    {barcode: 'SJ0632', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0633', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0634', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0635', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0636', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0637', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0638', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0639', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0640', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0643', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic 820 sound mixer'},
    {barcode: 'SJ0644', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S10 sound system'},
    {barcode: 'SJ0645', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S10 sound system'},
    {barcode: 'SJ0646', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S10 sound system'},
    {barcode: 'SJ0647', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S10 sound system'},
    {barcode: 'SJ0651', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0652', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0667', category: 'Projector Stand', manufacturer: 'Da-lite', model: 'Da-lite stand'},
    {barcode: 'SJ0668', category: 'Display', manufacturer: 'Dell', model: 'Dell 24" monitor'},
    {barcode: 'SJ0670', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0671', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0672', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic Powerpod 410 powered mixer'},
    {barcode: 'SJ0675', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S710 sound system'},
    {barcode: 'SJ0676', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S710 sound system'},
    {barcode: 'SJ0678', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic Powerpod 410 powered mixer'},
    {barcode: 'SJ0679', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S710 sound system'},
    {barcode: 'SJ0680', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S710 sound system'},
    {barcode: 'SJ0681', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0682', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0683', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0684', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica wired microphone'},
    {barcode: 'SJ0685', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S710 sound system'},
    {barcode: 'SJ0686', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic S710 sound system'},
    {barcode: 'SJ0687', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0688', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0689', category: 'Audio', manufacturer: 'Phonic', model: 'Phonic 620 powered mixer'},
    {barcode: 'SJ0696', category: 'Game', manufacturer: 'Namco', model: 'Taiko drums + game'},
    {barcode: 'SJ0697', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0699', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0700', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0702', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ0703', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ0705', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ0706', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ0708', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ0709', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ0714', category: 'Console', manufacturer: 'Microsoft', model: 'Xbox 360'},
    {barcode: 'SJ0715', category: 'Hotspot', manufacturer: 'Verizon', model: '16gb Hotspot'},
    {barcode: 'SJ0716', category: 'Console', manufacturer: 'Sony', model: 'Playstation 3'},
    {barcode: 'SJ0719', category: 'Controller', manufacturer: 'Sony', model: 'Miku Controller'},
    {barcode: 'SJ0721', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0722', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0723', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0724', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0726', category: 'Console', manufacturer: 'Sony', model: 'Playstation 3'},
    {barcode: 'SJ0727', category: 'Console', manufacturer: 'Sony', model: 'Playstation 4'},
    {barcode: 'SJ0728', category: 'Controller', manufacturer: 'Sony', model: 'Playstation 4 Controller'},
    {barcode: 'SJ0738', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0739', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0741', category: 'TV', manufacturer: '??', model: 'TV'},
    {barcode: 'SJ0774', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo Thinkpad'},
    {barcode: 'SJ0775', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo Thinkpad'},
    {barcode: 'SJ0776', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo Thinkpad'},
    {barcode: 'SJ0777', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo Thinkpad'},
    {barcode: 'SJ0779', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo Thinkpad'},
    {barcode: 'SJ0780', category: 'Laptop', manufacturer: 'Lenovo', model: 'Lenovo Thinkpad'},
    {barcode: 'SJ0782', category: 'Printer', manufacturer: 'Brother', model: 'Brother printer'},
    {barcode: 'SJ0784', category: 'Printer', manufacturer: 'Brother', model: 'Brother printer'},
    {barcode: 'SJ0785', category: 'Printer', manufacturer: 'Brother', model: 'Brother printer'},
    {barcode: 'SJ0786', category: 'Printer', manufacturer: 'Brother', model: 'Brother printer'},
    {barcode: 'SJ0799', category: 'Printer', manufacturer: 'Printer Gen', model: 'Printer'},
    {barcode: 'SJ0802', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0803', category: 'Microphone', manufacturer: 'Phonic', model: 'Phonic Dynamic Microphone'},
    {barcode: 'SJ0812', category: 'Microphone', manufacturer: 'AudioTechnica', model: 'AudioTechnica microphone'},
    {barcode: 'SJ0813', category: 'Speakers', manufacturer: 'Yamaha', model: 'Yamaha Speakers'},
    {barcode: 'SJ0814', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0825', category: 'Display', manufacturer: 'Asus', model: 'Asus 23" LCD Monitor'},
    {barcode: 'SJ0827', category: 'Speakers', manufacturer: 'Yamaha', model: 'Yamaha Speakers'},
    {barcode: 'SJ0828', category: 'Speaker', manufacturer: '??', model: 'Speaker Stand'},
    {barcode: 'SJ0841', category: 'Controller', manufacturer: 'Sony', model: 'Playstation 4 Controller'},
    {barcode: 'SJ1236', category: 'Laptop', manufacturer: 'Lenovo', model: 'Laptop'},
    {barcode: 'SJ1239', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ1250', category: 'Console', manufacturer: 'Sony', model: 'PS4'},
    {barcode: 'SJ1252', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ1265', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ1278', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ1320', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ1321', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ1322', category: 'Projector', manufacturer: 'ViewSonic', model: 'Projector'},
    {barcode: 'SJ1323', category: 'Projector', manufacturer: 'Epson', model: 'Ultra Short Projector'},
    {barcode: 'SJ1324', category: 'Megaphone', manufacturer: 'Groove', model: 'Megaphone'},
    {barcode: 'SJ1325', category: 'Projector', manufacturer: 'Epson', model: 'Ultra Short Projector'},
    {barcode: 'SJ0317', category: 'PA System', manufacturer: 'Yamaha', model: 'PA System'},
    {barcode: 'SJ0359', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0371', category: 'PA', manufacturer: '??', model: 'PA'},
    {barcode: 'SJ0385', category: 'HDMI', manufacturer: '??', model: 'HDMI Splitter'},
    {barcode: 'SJ0578', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0579', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0580', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0585', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0587', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0588', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0596', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0791', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0795', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0805', category: 'Microphone', manufacturer: '??', model: 'Microphone'},
    {barcode: 'SJ0820', category: 'Megaphone', manufacturer: '??', model: 'Loud Speaker'},
    {barcode: 'SJ0202', category: 'DVD Player', manufacturer: '??', model: 'TEST'},
    {barcode: 'SJ0206', category: 'DVD Player', manufacturer: '??', model: 'TEST'},
    {barcode: 'SJ1292', category: 'Laptop', manufacturer: '??', model: 'Tablet'},
    {barcode: 'SJ1294', category: 'Laptop', manufacturer: '??', model: 'Tablet'},
    {barcode: 'SJ1310', category: 'Printer', manufacturer: 'Brother', model: 'Brother printer'},
    {barcode: 'SJ1300', category: 'Hotspot', manufacturer: 'Verizon', model: '16gb Hotspot'},
    {barcode: 'SJ1166', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ1167', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ1168', category: 'Game', manufacturer: 'Namco', model: 'Taiko drums + game'},
    {barcode: 'SJ1169', category: 'Game', manufacturer: 'Namco', model: 'Taiko drums + game'},
    {barcode: 'SJ1170', category: 'Game', manufacturer: 'Namco', model: 'Taiko drums + game'},
    {barcode: 'SJ1171', category: 'Game', manufacturer: 'Namco', model: 'Taiko drums + game'},
    {barcode: 'SJ0361', category: 'Controller', manufacturer: '??', model: 'Project Diva Controller'},
    {barcode: 'SJ1172', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ1173', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ1174', category: 'Console', manufacturer: '??', model: 'Neo Geo Mini'},
    {barcode: 'SJ0248', category: 'Peripheral', manufacturer: 'Activision', model: 'DJ Hero controller'},
    {barcode: 'SJ1175', category: 'Console', manufacturer: 'Sony', model: 'PS4'},
    {barcode: 'SJ1176', category: 'Console', manufacturer: 'Sony', model: 'PS4'},
    {barcode: 'SJ1177', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ1178', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ1179', category: 'Controller', manufacturer: '??', model: 'NES Mini'},
    {barcode: 'SJ1180', category: 'Controller', manufacturer: '??', model: 'Fight Stick'},
    {barcode: 'SJ1181', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ1285', category: 'Display', manufacturer: '??', model: 'Monitor'},
    {barcode: 'SJ0004', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0005', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0007', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0013', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0014', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0015', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0016', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0017', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0018', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0019', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0021', category: 'Display', manufacturer: 'Upstar', model: 'TV'},
    {barcode: 'SJ0023', category: 'Display', manufacturer: 'Upstar', model: 'TV'},
    {barcode: 'SJ0024', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0030', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0032', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ0034', category: 'Display', manufacturer: 'Phillips', model: 'TV'},
    {barcode: 'SJ1237', category: 'Hotspot', manufacturer: 'AT&T', model: 'Hotspot'},
    {barcode: 'SJ1182', category: 'Hotspot', manufacturer: 'Moxee', model: 'Hotspot'},
    {barcode: 'SJ1183', category: 'DVD Player', manufacturer: 'Samsung', model: 'Blu Ray Player'},
    {barcode: 'SJ0614', category: 'Monetary Supplies', manufacturer: 'Unsorted', model: 'Safe'}];


import {initializeApp} from "firebase/app";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
let creds = null;
let fbauth = null;

function setupAuth() {
    if (fbauth === null) {
        const firebaseConfig = {
            apiKey: "AIzaSyAGPcx9jOMAK-Z65fgDfykoNw06leABeSM",
            authDomain: "convention-ninja.firebaseapp.com",
            projectId: "convention-ninja",
            storageBucket: "convention-ninja.appspot.com",
            messagingSenderId: "656645627437",
            appId: "1:656645627437:web:1d957f0266da7767fce2a4"
        };
        initializeApp(firebaseConfig);
        fbauth = getAuth();
    }
    return fbauth;
}

async function createAccount() {
    if (creds === null) {
        try {
            creds = await createUserWithEmailAndPassword(fbauth, "sjinventory@convention.ninja", "-aAjaQ-_#6WNkP2q")
        } catch (e) {
            console.error(e)
            creds = await signInWithEmailAndPassword(fbauth, "sjinventory@convention.ninja", "-aAjaQ-_#6WNkP2q")
        }
    }
    return creds
}

await setupAuth();
await createAccount();

async function doImport()
{
    const orgId = '1505058680721117184'

    let catraw = new Set(data.map(e => e.category));
    let cats = [];
    for (let item of catraw) {
        let res = await fetch(`https://convention.ninja/api/orgs/${orgId}/inventory/categories`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + await creds.user.getIdToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: item
            })
        });
        if(res.status >= 300) {
            continue;
        }
        let cat = await res.json();
        cats.push(cat);
    }
    console.log(JSON.stringify(cats))
    let mfgraw = new Set(data.map(e => e.manufacturer));
    let mfgs = [];
    for (let item of mfgraw) {
        let res = await fetch(`https://convention.ninja/api/orgs/${orgId}/inventory/manufacturers`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + await creds.user.getIdToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: item
            })
        });
        if(res.status >= 300) {
            continue;
        }
        let mfg = await res.json();
        mfgs.push(mfg);
    }
    console.log(JSON.stringify(mfgs))
    let modelsraw = new Set(data.map(e => `${e.model}|${e.manufacturer}|${e.category}`));
    let models = [];
    for (let item of modelsraw) {
        let itemSplit = item.split('|')
        let res = await fetch(`https://convention.ninja/api/orgs/${orgId}/inventory/models`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + await creds.user.getIdToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: itemSplit[0],
                categoryId: cats.find(e => e.name === itemSplit[2]).id,
                manufacturerId: mfgs.find(e => e.name === itemSplit[1]).id
            })
        });
        if(res.status >= 300) {
            continue;
        }
        let model = await res.json();
        model.category = cats.find(e => e.name === itemSplit[2]);
        model.manufacturer = mfgs.find(e => e.name === itemSplit[1]);
        models.push(model);
    }
    console.log(JSON.stringify(models));
    for (let item of data) {
        let res = await fetch(`https://convention.ninja/api/orgs/${orgId}/inventory/assets`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + await creds.user.getIdToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                serialNumber: '',
                modelId: models.find(e => e.name === item.model && e.manufacturer.name === item.manufacturer && e.category.name === item.category).id,
                assetTags: [item.barcode]
            })
        });
        if(res.status >= 300) {
            continue;
        }
        let asset = await res.json();
        console.log(JSON.stringify(asset))
    }
}

await doImport();