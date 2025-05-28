'use client'
import Image from "next/image";
import { useState } from "react";

// mock数据（可与award-badge页保持一致）
const mockUsers = [
  { id: 1, name: "贝尔纳黛·科马克", avatar: "/avatar1.jpg", intro: "新元自我介绍...", userId: "Ethanovum" },
  { id: 2, name: "利维娅·鲁曹", avatar: "/avatar2.jpg", intro: "状态信息", userId: "KORSCO-GpN" },
  { id: 3, name: "泽菲琳·阿芙黛", avatar: "/avatar3.jpg", intro: "志愿者", userId: "3BzkDAFFkc" },
  { id: 4, name: "塔拉萨·维鲁", avatar: "/avatar4.jpg", intro: "正在参与", userId: "4imoryZMCK" },
  { id: 5, name: "凯尔特·维里提", avatar: "/avatar5.jpg", intro: "志愿者服务", userId: "u5YXS-lYpx" },
  { id: 6, name: "霍拉斯·毛光斯", avatar: "/avatar6.jpg", intro: "守护孩子的内心灵魂", userId: "7KtqHgkOdVE" },
  { id: 7, name: "奥里奥·索恩", avatar: "/avatar7.jpg", intro: "积极寻找人生的意义", userId: "B5Yr6Lj67D" },
  { id: 8, name: "艾莉西亚·达布尔", avatar: "/avatar8.jpg", intro: "暂无自我介绍...", userId: "xBWFJgJYk" },
];

const mockBadges = [
  { id: 1, name: "勤学勋章", image: "/badge1.png" },
  { id: 2, name: "助人勋章", image: "/badge2.png" },
  { id: 3, name: "创新勋章", image: "/badge3.png" },
];

// mock授予记录
const mockRecords = [
  { userId: 1, badgeId: 1 },
  { userId: 1, badgeId: 2 },
  { userId: 2, badgeId: 2 },
  { userId: 3, badgeId: 1 },
  { userId: 4, badgeId: 3 },
  { userId: 5, badgeId: 1 },
  { userId: 5, badgeId: 3 },
  { userId: 7, badgeId: 2 },
];

// 聚合每个用户的勋章
const getUserBadges = (userId: number) => {
  const badgeIds = mockRecords.filter(r => r.userId === userId).map(r => r.badgeId);
  return mockBadges.filter(b => badgeIds.includes(b.id));
};

export default function Home() {
  const [search, setSearch] = useState("");
  const filteredUsers = mockUsers.filter(u => u.name.includes(search) || u.userId.includes(search));

  return (
    <div className="min-h-screen bg-[#f7f9fa] pb-12">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">志愿者网络</h1>
          <a
            href="/award-badge"
            className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-500 transition"
          >
            勋章授予
          </a>
        </div>
        <input
          className="mb-8 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full max-w-xl"
          placeholder="搜索志愿者、ID或自我介绍..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map(user => {
            const badges = getUserBadges(user.id);
            return (
              <div key={user.id} className="bg-white rounded-2xl shadow p-6 flex flex-col items-start gap-3 relative">
                <div className="flex items-center gap-3 mb-2 w-full">
                  <Image src={user.avatar} alt={user.name} width={56} height={56} className="rounded-full border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold text-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-gray-400 truncate">ID: {user.userId}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center min-h-[32px] ml-2">
                    {badges.length === 0 ? (
                      <span className="text-xs text-gray-400">暂无勋章</span>
                    ) : (
                      badges.map(badge => (
                        <div key={badge.id} className="flex items-center gap-1 group">
                          <Image src={badge.image} alt={badge.name} width={24} height={24} className="rounded-full border border-gray-200" />
                          <span className="text-xs text-gray-500 group-hover:text-blue-600" title={badge.name}>{badge.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 min-h-[32px] mb-2">{user.intro}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
