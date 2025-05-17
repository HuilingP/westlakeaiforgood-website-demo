'use client'
import Image from "next/image";
import { useState, useRef } from "react";

const mockUsers = [
  { id: 1, name: "贝尔纳黛·科马克", avatar: "/avatar1.jpg" },
  { id: 2, name: "利维娅·鲁曹", avatar: "/avatar2.jpg" },
  { id: 3, name: "泽菲琳·阿芙黛", avatar: "/avatar3.jpg" },
  { id: 4, name: "塔拉萨·维鲁", avatar: "/avatar4.jpg" },
  { id: 5, name: "凯尔特·维里提", avatar: "/avatar5.jpg" },
  { id: 6, name: "霍拉斯·毛光斯", avatar: "/avatar6.jpg" },
  { id: 7, name: "奥里奥·索恩", avatar: "/avatar7.jpg" },
  { id: 8, name: "艾莉西亚·达布尔", avatar: "/avatar8.jpg" },
];

const initialBadges = [
  { id: 1, name: "勤学勋章", image: "/badge1.png" },
  { id: 2, name: "助人勋章", image: "/badge2.png" },
  { id: 3, name: "创新勋章", image: "/badge3.png" },
];

export default function AwardBadgePage() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [badges, setBadges] = useState(initialBadges);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片选择
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadImage(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  // 上传勋章
  const handleUploadBadge = () => {
    if (!uploadName.trim() || !uploadImage) return;
    const newBadge = {
      id: badges.length + 1,
      name: uploadName.trim(),
      image: uploadPreview!, // 仅本地预览
    };
    setBadges([...badges, newBadge]);
    setShowUpload(false);
    setUploadName("");
    setUploadImage(null);
    setUploadPreview(null);
    setSelectedBadge(newBadge.id);
  };

  // 取消上传
  const handleCancelUpload = () => {
    setShowUpload(false);
    setUploadName("");
    setUploadImage(null);
    setUploadPreview(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f7f9fa]">
      {/* 左侧用户列表 */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h2 className="text-lg font-bold mb-4">选择用户</h2>
        <input
          className="mb-4 px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="搜索用户..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <ul className="flex-1 overflow-y-auto">
          {mockUsers.filter(u => u.name.includes(search)).map(user => (
            <li
              key={user.id}
              className={`flex items-center gap-3 px-2 py-2 rounded cursor-pointer mb-1 transition border border-transparent ${selectedUser === user.id ? "bg-blue-50 border-blue-400" : "hover:bg-gray-100"}`}
              onClick={() => setSelectedUser(user.id)}
            >
              <Image src={user.avatar} alt={user.name} width={36} height={36} className="rounded-full" />
              <span className="text-sm font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* 右侧勋章授予表单 */}
      <main className="flex-1 flex flex-col items-center justify-center p-12">
        <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-8 text-center">勋章授予</h1>

          {/* 勋章选择和上传 */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">选择勋章</label>
            <div className="flex gap-4 flex-wrap">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center cursor-pointer p-2 rounded border transition ${selectedBadge === badge.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                  onClick={() => setSelectedBadge(badge.id)}
                >
                  <Image src={badge.image} alt={badge.name} width={48} height={48} />
                  <span className="mt-2 text-xs">{badge.name}</span>
                </div>
              ))}
              {/* 上传勋章卡片 */}
              <div
                className="flex flex-col items-center justify-center cursor-pointer p-2 rounded border border-dashed border-gray-300 hover:bg-gray-50 w-[72px] h-[90px]"
                onClick={() => setShowUpload(true)}
              >
                <span className="text-3xl text-gray-400 mb-1">+</span>
                <span className="text-xs text-gray-500">上传勋章</span>
              </div>
            </div>
            {/* 上传勋章弹窗 */}
            {showUpload && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-80 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={handleCancelUpload}
                    aria-label="关闭"
                  >×</button>
                  <h3 className="text-lg font-bold mb-4 text-center">上传新勋章</h3>
                  <div className="mb-4 flex flex-col items-center">
                    {uploadPreview ? (
                      <Image src={uploadPreview} alt="预览" width={64} height={64} className="rounded mb-2" />
                    ) : (
                      <div
                        className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded mb-2 cursor-pointer border border-dashed border-gray-300"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span className="text-2xl text-gray-400">+</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    <button
                      className="text-xs text-blue-600 underline mt-1"
                      onClick={() => fileInputRef.current?.click()}
                    >选择图片</button>
                  </div>
                  <input
                    className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-4"
                    placeholder="勋章名称"
                    value={uploadName}
                    onChange={e => setUploadName(e.target.value)}
                  />
                  <button
                    className="w-full py-2 rounded bg-blue-600 text-white font-bold disabled:bg-gray-300 transition"
                    disabled={!uploadName.trim() || !uploadImage}
                    onClick={handleUploadBadge}
                  >
                    确认上传
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 授予理由 */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">授予理由（可选）</label>
            <textarea
              className="w-full px-3 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={3}
              placeholder="请输入授予理由..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          {/* 授予按钮 */}
          <button
            className="w-full py-3 rounded bg-blue-600 text-white font-bold text-lg disabled:bg-gray-300 transition"
            disabled={!selectedUser || !selectedBadge}
          >
            授予勋章
          </button>
        </div>
      </main>
    </div>
  );
} 
