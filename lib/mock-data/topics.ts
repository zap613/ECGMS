//  Topic interface và mock data cho các đề tài trong hệ thống

export interface Topic {
topicId: string;
topicName: string;
description: string;
isRegistered: boolean; // Đề tài này đã có nhóm đăng ký chưa
}

export const mockTopics: Topic[] = [
{
topicId: "TOP01",
topicName: "E-commerce Platform for Local Artisans",
description: "A web platform to connect local artisans with customers, supporting online sales and inventory management.",
isRegistered: true,
},
{
topicId: "TOP02",
topicName: "Educational Mobile App for Children",
description: "An interactive mobile app for teaching children basic programming concepts through games.",
isRegistered: true,
},
{
topicId: "TOP03",
topicName: "AI-Powered Healthcare Chatbot",
description: "A chatbot to provide preliminary health advice and schedule appointments based on symptoms.",
isRegistered: false,
},
{
topicId: "TOP04",
topicName: "Smart Campus Navigation System",
description: "An indoor navigation app for FPT University campus using IoT beacons and augmented reality.",
isRegistered: false,
},
];