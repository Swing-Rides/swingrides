import { PriceCardProps, TabContentProps } from "@/components/pages/forHostsLandingpageComponents/types"

export const fleetManagementContent: TabContentProps = {
        image: {
                src: '/images/fleet-management.png',
                alt: 'Fleet Management',
        },
        content: [
                {
                        icon: (
                                <svg width= "28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                <path d="M22.1673 19.8332H24.5007C25.2007 19.8332 25.6673 19.3665 25.6673 18.6665V15.1665C25.6673 14.1165 24.8507 13.1832 23.9173 12.9498C21.8173 12.3665 18.6673 11.6665 18.6673 11.6665C18.6673 11.6665 17.1507 10.0332 16.1007 8.98317C15.5173 8.5165 14.8173 8.1665 14.0007 8.1665H5.83398C5.13398 8.1665 4.55065 8.63317 4.20065 9.2165L2.56732 12.5998C2.41283 13.0504 2.33398 13.5235 2.33398 13.9998V18.6665C2.33398 19.3665 2.80065 19.8332 3.50065 19.8332H5.83398" stroke = "#1A56DB" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.16634 22.1662C9.45501 22.1662 10.4997 21.1215 10.4997 19.8328C10.4997 18.5442 9.45501 17.4995 8.16634 17.4995C6.87768 17.4995 5.83301 18.5442 5.83301 19.8328C5.83301 21.1215 6.87768 22.1662 8.16634 22.1662Z" stroke = "#1A56DB" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.5005 19.8335H17.5005" stroke = "#1A56DB" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19.8333 22.1667C21.122 22.1667 22.1667 21.122 22.1667 19.8333C22.1667 18.5447 21.122 17.5 19.8333 17.5C18.5447 17.5 17.5 18.5447 17.5 19.8333C17.5 21.122 18.5447 22.1667 19.8333 22.1667Z" stroke = "#1A56DB" strokeWidth="1.66656" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                        ),
                        label: 'Manage all vehicles in one place',
                },
                {
                        icon: (
                                <svg width= "28" height = "28" viewBox = "0 0 28 28" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
                                        <path d="M6.17361 3.9375H21.8264C21.8264 3.9375 24.0625 3.9375 24.0625 6.17361V21.8264C24.0625 21.8264 24.0625 24.0625 21.8264 24.0625H6.17361C6.17361 24.0625 3.9375 24.0625 3.9375 21.8264V6.17361C3.9375 6.17361 3.9375 3.9375 6.17361 3.9375Z" stroke = "#1A56DB" strokeLinecap = "round" strokeLinejoin = "round" />
                                                <path d="M19.5902 13.9999H17.3541L15.118 19.5902L12.8819 8.40967L10.6458 13.9999H8.40967" stroke = "#1A56DB" strokeLinecap = "round" strokeLinejoin = "round" />
                                                        </svg>
                        ),
                        label: 'Track availability and status in real-time',
                },
                {
                        icon: (
                                <svg width= "28" height = "28" viewBox = "0 0 28 28" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
                                                <path d="M16.2363 3.9375V8.40972C16.2363 8.55655 16.2652 8.70193 16.3214 8.83758C16.3776 8.97323 16.46 9.09649 16.5638 9.20031C16.6676 9.30413 16.7909 9.38648 16.9265 9.44267C17.0622 9.49886 17.2076 9.52778 17.3544 9.52778H21.8266" stroke = "#1A56DB" strokeLinecap = "round" strokeLinejoin = "round" />
                                                        <path d="M19.5905 24.0625H8.40994C7.81689 24.0625 7.24812 23.8269 6.82877 23.4076C6.40942 22.9882 6.17383 22.4194 6.17383 21.8264V6.17361C6.17383 5.58056 6.40942 5.01179 6.82877 4.59244C7.24812 4.17309 7.81689 3.9375 8.40994 3.9375H16.2363L21.8266 9.52778V21.8264C21.8266 22.4194 21.591 22.9882 21.1717 23.4076C20.7523 23.8269 20.1835 24.0625 19.5905 24.0625Z" stroke = "#1A56DB" strokeLinecap = "round" strokeLinejoin = "round" />
                                                                <path d="M10.646 10.646H11.7641" stroke = "#1A56DB" strokeLinecap = "round" strokeLinejoin = "round" />
                                                                        <path d="M10.646 15.1182H17.3543" stroke = "#1A56DB" strokeLinecap = "round" strokeLinejoin = "round" />
                                                                                <path d="M10.646 19.5903H17.3543" stroke = "#1A56DB" strokeLinecap = "round" strokeLinejoin = "round" />
                                                                                        </svg>
                        ),
                        label: 'View full vehicle details and service history',
                },
        ],
};

export const bookingContent: TabContentProps = {
        image: {
                src: '/images/bookings.png',
                alt: 'Booking',
        },
        content: [
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1223_16115)">
                                                <path d="M24.901 4.77637H3.09896C2.17273 4.77637 1.42188 5.52722 1.42188 6.45345V24.9014C1.42188 25.8276 2.17273 26.5785 3.09896 26.5785H24.901C25.8272 26.5785 26.5781 25.8276 26.5781 24.9014V6.45345C26.5781 5.52722 25.8272 4.77637 24.901 4.77637Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M1.42188 11.4844H26.5781" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8.12988 7.29167V1.42188" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M19.8701 7.29167V1.42188" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6.8724 16.5153C6.64084 16.5153 6.45312 16.3276 6.45312 16.096C6.45312 15.8645 6.64084 15.6768 6.8724 15.6768" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M6.87207 16.5153C7.10363 16.5153 7.29134 16.3276 7.29134 16.096C7.29134 15.8645 7.10363 15.6768 6.87207 15.6768" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M6.8724 22.3854C6.64084 22.3854 6.45312 22.1977 6.45312 21.9661C6.45312 21.7346 6.64084 21.5469 6.8724 21.5469" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M6.87207 22.3854C7.10363 22.3854 7.29134 22.1977 7.29134 21.9661C7.29134 21.7346 7.10363 21.5469 6.87207 21.5469" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M14.0003 16.5153C13.7688 16.5153 13.5811 16.3276 13.5811 16.096C13.5811 15.8645 13.7688 15.6768 14.0003 15.6768" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M14 16.5153C14.2315 16.5153 14.4193 16.3276 14.4193 16.096C14.4193 15.8645 14.2315 15.6768 14 15.6768" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M14.0003 22.3854C13.7688 22.3854 13.5811 22.1977 13.5811 21.9661C13.5811 21.7346 13.7688 21.5469 14.0003 21.5469" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M14 22.3854C14.2315 22.3854 14.4193 22.1977 14.4193 21.9661C14.4193 21.7346 14.2315 21.5469 14 21.5469" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M21.1273 16.5153C20.8957 16.5153 20.708 16.3276 20.708 16.096C20.708 15.8645 20.8957 15.6768 21.1273 15.6768" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M21.1279 16.5153C21.3595 16.5153 21.5472 16.3276 21.5472 16.096C21.5472 15.8645 21.3595 15.6768 21.1279 15.6768" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M21.1273 22.3854C20.8957 22.3854 20.708 22.1977 20.708 21.9661C20.708 21.7346 20.8957 21.5469 21.1273 21.5469" stroke="#1A56DB" strokeWidth="1.5" />
                                                <path d="M21.1279 22.3854C21.3595 22.3854 21.5472 22.1977 21.5472 21.9661C21.5472 21.7346 21.3595 21.5469 21.1279 21.5469" stroke="#1A56DB" strokeWidth="1.5" />
                                        </g>
                                        <defs>
                                                <clipPath id="clip0_1223_16115">
                                                        <rect width="28" height="28" fill="white" />
                                                </clipPath>
                                        </defs>
                                </svg>
                        ),
                        label: 'Manage bookings from request to completion',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.1033 6.94807C18.1033 6.94807 19.665 6.17871 14.0001 6.17871C11.9713 6.17871 9.98805 6.7803 8.30111 7.90748C6.61423 9.03465 5.29945 10.6367 4.52303 12.5111C3.74662 14.3855 3.5435 16.448 3.93929 18.4378C4.33508 20.4277 5.31205 22.2555 6.7467 23.6901C8.18123 25.1247 10.0091 26.1016 11.9989 26.4974C13.9887 26.8932 16.0512 26.6901 17.9256 25.9137C19.8001 25.1373 21.4021 23.8225 22.5292 22.1356C23.6564 20.4487 24.258 18.4655 24.258 16.4366" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                                        <path d="M14 1.30566L19.1286 6.43427L14 11.5629" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                        ),
                        label: 'Track status: Pending → Active → Completed',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.51562 14C2.51563 17.0458 3.72558 19.9669 5.87932 22.1207C8.03306 24.2744 10.9542 25.4844 14 25.4844C17.0458 25.4844 19.9669 24.2744 22.1207 22.1207C24.2744 19.9669 25.4844 17.0458 25.4844 14C25.4844 10.9542 24.2744 8.03306 22.1207 5.87932C19.9669 3.72558 17.0458 2.51563 14 2.51562C10.9542 2.51563 8.03306 3.72558 5.87932 5.87932C3.72558 8.03306 2.51563 10.9542 2.51562 14Z" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M7.73242 14H20.2668" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M14 7.73242V20.2668" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" />
                                </svg>
                        ),
                        label: 'Create bookings manually or receive them instantly',
                },
        ],
};

export const financesContent: TabContentProps = {
        image: {
                src: '/images/finances.png',
                alt: 'Finances',
        },
        content: [
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M26.5781 25.4844H2.51562V1.42188" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M7.74414 13.9785H12.9723V25.4848H7.74414V13.9785Z" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M18.2109 9.78906H23.4391V25.4844H18.2109V9.78906Z" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M12.9824 4.56055H18.2105V25.484H12.9824V4.56055Z" stroke="#1A56DB" strokeWidth="1.5" strokeMiterlimit="10" />
                                </svg>
                        ),
                        label: `Track every naira — know exactly what you're making`,
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24.6582 13.3141C24.5622 12.5075 24.4328 11.8227 24.296 11.0998C24.289 11.0627 24.282 11.0255 24.275 10.9882C23.9062 9.0353 22.2312 7.46606 20.1286 7.16862C20.1034 7.16506 20.0782 7.1615 20.0532 7.15794C20.0394 7.06576 20.0266 6.97414 20.0148 6.88298C22.1914 5.90102 21.6274 2.85518 19.507 2.41398C17.7687 2.0523 13.7361 1.91406 11.3253 1.91406C9.0381 1.91406 7.50798 2.23372 5.87268 2.57534C5.78432 2.5938 5.69566 2.61232 5.60654 2.63088C3.85588 2.99512 2.46128 4.9168 2.1542 7.30828C2.14832 7.354 2.14246 7.39958 2.13662 7.44502C1.90669 9.23376 1.70117 10.8326 1.70117 13.8554C1.70117 14.3661 1.70704 14.8362 1.7179 15.2734C1.70701 15.6028 1.70117 15.9549 1.70117 16.3346C1.70117 18.803 1.94801 20.1086 2.22416 21.5692C2.23118 21.6064 2.23822 21.6436 2.24528 21.681C2.61408 23.6338 4.28906 25.203 6.39166 25.5006C6.49872 25.5156 6.60522 25.5308 6.71138 25.5458C8.6754 25.8248 10.5131 26.0858 13.2601 26.0858C16.0072 26.0858 17.8449 25.8248 19.809 25.5458C19.9151 25.5308 20.0216 25.5156 20.1286 25.5006C22.2312 25.203 23.9062 23.6338 24.275 21.681C24.282 21.6436 24.289 21.6064 24.296 21.5692C24.428 20.871 24.5534 20.2082 24.6482 19.4369" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8.78223 7.13846C10.1546 7.03552 12.4191 6.78906 14.7755 6.78906C17.2148 6.78906 18.3691 6.91346 19.9696 7.13846" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M24.6836 19.4397H21.5518C19.8604 19.4397 18.4893 18.0685 18.4893 16.3771C18.4893 14.6856 19.8604 13.3145 21.5518 13.3145H24.6836C25.7882 13.3145 26.6836 14.2099 26.6836 15.3145V17.4397C26.6836 18.5443 25.7882 19.4397 24.6836 19.4397Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                        ),
                        label: 'See revenue, expenses, and profit in one place',
                },
                {
                        icon: (
                                < svg width = "28" height = "28" viewBox = "0 0 28 28" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
                                        <g clipPath="url(#clip0_1223_16178)">
                                                <path d="M19.8695 24.9014H13.1611" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10.3662 15.3975H17.6336" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10.3662 11.4844H17.6336" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M10.3662 7.57129H17.6336" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M23.224 1.42188H21.5469V7.57118H26.5781V4.77604C26.5781 3.88646 26.2247 3.03332 25.5957 2.40429C24.9667 1.77526 24.1135 1.42188 23.224 1.42188Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M15.6771 19.8698H4.77604C3.88646 19.8698 3.03332 20.2232 2.40429 20.8522C1.77526 21.4812 1.42188 22.3344 1.42188 23.224V26.5781H13.1615V22.3854C13.1615 21.7183 13.4265 21.0784 13.8983 20.6066C14.3701 20.1349 15.0099 19.8698 15.6771 19.8698ZM15.6771 19.8698C16.3442 19.8698 16.9841 20.1349 17.4559 20.6066C17.9276 21.0784 18.1927 21.7183 18.1927 22.3854V23.224C18.1927 23.6687 18.3694 24.0954 18.6839 24.4099C18.9984 24.7244 19.425 24.901 19.8698 24.901C20.3146 24.901 20.7412 24.7244 21.0557 24.4099C21.3702 24.0954 21.5469 23.6687 21.5469 23.224V1.42188H9.80729C8.91771 1.42188 8.06457 1.77526 7.43554 2.40429C6.80651 3.03332 6.45312 3.88646 6.45312 4.77604V19.8698" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </g>
                                        <defs>
                                                <clipPath id="clip0_1223_16178">
                                                        <rect width="28" height="28" fill="white"/>
                                                </clipPath>
                                        </defs>
                                </svg >

                        ),
                        label: 'Generate invoices and payment links instantly',
                },
        ],
};

export const maintenanceContent: TabContentProps = {
        image: {
                src: '/images/maintenance.png',
                alt: 'Maintenance',
        },
        content: [
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1223_16189)">
                                <path d="M26.8187 7.19262C26.7801 6.98304 26.6979 6.78392 26.5773 6.60818C26.4567 6.43246 26.3005 6.28406 26.1187 6.17262L22.1187 10.1726C21.9321 10.3662 21.7085 10.5202 21.4611 10.6253C21.2137 10.7305 20.9475 10.7847 20.6787 10.7847C20.4099 10.7847 20.1439 10.7305 19.8964 10.6253C19.649 10.5202 19.4253 10.3662 19.2388 10.1726L17.7188 8.81262C17.3523 8.43876 17.1471 7.93612 17.1471 7.41262C17.1471 6.88912 17.3523 6.38648 17.7188 6.01262L21.7187 2.01262C21.6315 1.80769 21.5003 1.62444 21.3345 1.47583C21.1685 1.32722 20.9721 1.21688 20.7587 1.15262C19.3631 0.874298 17.9174 0.993434 16.5861 1.49646C15.2548 1.99949 14.0916 2.8662 13.2287 3.99792C12.3658 5.12964 11.8381 6.4809 11.7055 7.89784C11.5813 9.22516 11.8086 10.5602 12.3622 11.7694L1.62876 22.5028C0.83642 23.2952 0.84956 24.5838 1.65789 25.3598L2.77945 26.4366C3.56173 27.1876 4.80003 27.1784 5.57101 26.4156L16.4277 15.6765C17.6019 16.1615 18.881 16.3459 20.1485 16.2101C21.5499 16.0598 22.8823 15.5238 23.9973 14.6616C25.1125 13.7994 25.9665 12.6448 26.4645 11.3262C26.9627 10.0076 27.0853 8.57672 26.8187 7.19262Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_1223_16189">
                                <rect width="28" height="28" fill="white"/>
                                </clipPath>
                                </defs>
                                </svg>
                        ),
                        label: 'Track service history and vehicle health',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 10.6455V15.1177" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.17 4.59862L3.10709 19.7304C2.92026 20.0539 2.82139 20.4208 2.82032 20.7944C2.81925 21.168 2.91602 21.5354 3.10099 21.86C3.28597 22.1846 3.55271 22.4551 3.87468 22.6447C4.19665 22.8342 4.56264 22.9361 4.93623 22.9403H23.0644C23.4378 22.936 23.8036 22.8341 24.1254 22.6446C24.4472 22.4551 24.7139 22.1847 24.8988 21.8603C25.0838 21.5358 25.1806 21.1686 25.1797 20.7952C25.1787 20.4217 25.0801 20.055 24.8935 19.7315L15.8306 4.5975C15.6399 4.28277 15.3713 4.02253 15.0507 3.84191C14.7301 3.6613 14.3683 3.56641 14.0003 3.56641C13.6323 3.56641 13.2706 3.6613 12.9499 3.84191C12.6293 4.02253 12.3607 4.28389 12.17 4.59862Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M14 18.4727H14.0112" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                        ),
                        label: 'Get alerts for upcoming or overdue service',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.17578 4.74414C7.47312 4.83166 6.77824 4.92268 6.09188 5.007C5.13372 5.12472 4.37648 5.89274 4.3087 6.85572C3.8971 12.7024 3.8971 18.2261 4.3087 24.0727C4.3765 25.0357 5.1339 25.8061 6.09588 25.8869C11.3914 26.3307 16.2336 26.3307 21.5292 25.8869C22.4912 25.8061 23.2486 25.0357 23.3164 24.0727C23.7278 18.2261 23.7278 12.7024 23.3164 6.85572C23.2486 5.89274 22.4912 5.12472 21.5332 5.007C20.8468 4.92268 20.1518 4.83166 19.4492 4.74414" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.1242 1.5H16.5002C16.5002 1.5 19.4683 1.5 19.4683 4.468C19.4683 4.468 19.4682 7.438 16.5002 7.438H11.1242C11.1242 7.438 8.15625 7.438 8.15625 4.47C8.15625 4.47 8.15625 1.5 11.1242 1.5Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                        ),
                        label: 'Log costs and maintenance records easily',
                },
        ],
};

export const reportsContent: TabContentProps = {
        image: {
                src: '/images/reports.png',
                alt: 'Reports',
        },
        content: [
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.9375 3.9375V24.0625H24.0625" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M21.8268 10.6455L16.2365 16.2358L11.7643 11.7636L8.41016 15.1177" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                        ),
                        label: 'See exactly how your fleet is performing',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M27.7203 6.43085V13.9995C27.7203 15.0919 26.5377 15.7747 25.5916 15.2285C25.1525 14.975 24.8821 14.5065 24.8821 13.9995V9.86039L15.9522 18.7914C15.3976 19.3479 14.4964 19.3479 13.9418 18.7914L10.2178 15.0638L2.7071 22.5722C1.93329 23.346 0.611975 22.9919 0.328749 21.9349C0.197291 21.4443 0.337553 20.9209 0.696675 20.5617L9.21141 12.047C9.76601 11.4905 10.6672 11.4905 11.2218 12.047L14.9482 15.7734L22.8716 7.84997H18.7325C17.6401 7.84992 16.9573 6.66728 17.5036 5.72123C17.7571 5.28218 18.2255 5.01172 18.7325 5.01172H26.3012C27.0849 5.01172 27.7203 5.64709 27.7203 6.43085Z" fill="#1A56DB" />
                                </svg>

                        ),
                        label: 'Track revenue, bookings, and profit',
                },
                {
                        icon: (
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.1416 26.209C24.0424 26.209 24.7696 25.4817 24.7696 24.5809V6.54356C24.7696 6.10953 24.5958 5.68624 24.2811 5.38235L21.0253 2.25672C20.7213 1.95283 20.309 1.79004 19.8858 1.79004H4.85836C3.95765 1.79004 3.23047 2.51722 3.23047 3.41804V24.5809C3.23047 25.4817 3.95765 26.209 4.85836 26.209H23.1416Z" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10.2969 11.8485L14.0015 8.14355L17.7064 11.8485" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M13.998 8.14355V19.855" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                        ),
                        label: 'Export reports for accounting',
                },
        ],
};

export const pricingContents: PriceCardProps[] = [
        {
                cardTitle: 'Starter',
                price: 29,
                vechileQuantity: 'Up to 5 vehicles',
                features: [
                        'Booking management',
                        'Mileage tracking',
                        'Basic maintenance alerts',
                        'Expense capture',
                        'Toll records',
                        'Basic reports'
                ]
        },
        {
                badge: 'Most Popular',
                cardTitle: 'Professional',
                price: 79,
                vechileQuantity: 'Up to 25 vehicles',
                features: [
                        'Everything in Starter',
                        'Expense capture + invoicing',
                        'Toll record history',
                        '10 custom fields',
                        'Financial reports + audit export',
                        'Customer portal',
                        'White label branding'
                ]
        },
        {
                cardTitle: 'Enterprise',
                price: 'Custom',
                vechileQuantity: 'Unlimited vehicles',
                features: [
                        'Everything in Professional',
                        'White label branding',
                        'API access',
                        'Multi-location support',
                        'Dedicated support',
                        'Custom integrations',
                ]
        },
]