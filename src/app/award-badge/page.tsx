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

function Toast({ show, message }: { show: boolean; message: string }) {
  return show ? (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg text-base animate-fade-in">
      {message}
    </div>
  ) : null;
}

type AwardRecord = {
  user: { id: number; name: string; avatar: string };
  badge: { id: number; name: string; image: string };
  reason: string;
  time: string;
};

export default function AwardBadgePage() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<number[]>([]);
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [badges, setBadges] = useState(initialBadges);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [records, setRecords] = useState<AwardRecord[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 用户多选
  const toggleUser = (id: number) => {
    setSelectedUsers(users => users.includes(id) ? users.filter(u => u !== id) : [...users, id]);
  };
  const allUserIds = mockUsers.map(u => u.id);
  const allSelected = selectedUsers.length === allUserIds.length;
  const toggleAllUsers = () => {
    setSelectedUsers(allSelected ? [] : allUserIds);
  };

  // 勋章多选
  const toggleBadge = (id: number) => {
    setSelectedBadges(badgesSel => badgesSel.includes(id) ? badgesSel.filter(b => b !== id) : [...badgesSel, id]);
  };

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
      image: uploadPreview!,
    };
    setBadges([...badges, newBadge]);
    setShowUpload(false);
    setUploadName("");
    setUploadImage(null);
    setUploadPreview(null);
    setSelectedBadges(b => [...b, newBadge.id]);
  };

  // 取消上传
  const handleCancelUpload = () => {
    setShowUpload(false);
    setUploadName("");
    setUploadImage(null);
    setUploadPreview(null);
  };

  // 授予勋章
  const handleAward = () => {
    if (!selectedUsers.length || !selectedBadges.length) return;
    const now = new Date().toLocaleString();
    const newRecords: AwardRecord[] = [];
    selectedUsers.forEach(uid => {
      selectedBadges.forEach(bid => {
        newRecords.push({
          user: mockUsers.find(u => u.id === uid)!,
          badge: badges.find(b => b.id === bid)!,
          reason,
          time: now,
        });
      });
    });
    setRecords(r => [...newRecords, ...r]);
    setReason("");
    setSelectedUsers([]);
    setSelectedBadges([]);
    setToastMsg('勋章授予成功！');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  // 撤回授予
  const handleRevoke = (idx: number) => {
    if (window.confirm('确定要撤回该勋章授予吗？')) {
      setRecords(r => r.filter((_, i) => i !== idx));
      setToastMsg('勋章授予已撤回');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col pb-12">
      <Toast show={showToast} message={toastMsg || "勋章授予成功！"} />
      <div className="flex-1 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto w-full px-2 lg:px-8 pt-8">
        {/* 左栏：授予勋章模块 */}
        <section className="bg-white rounded-2xl shadow-lg p-8 w-full lg:w-[300px] flex flex-col mb-4 lg:mb-0 h-fit">
          <h1 className="text-2xl font-bold mb-8 text-center text-blue-700 tracking-tight">勋章授予</h1>
          {/* 勋章选择和上传 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3 text-gray-700">选择勋章</label>
            <div className="flex gap-4 flex-wrap">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center cursor-pointer p-3 rounded-xl border-2 transition relative w-[90px] h-[110px] shadow-sm ${selectedBadges.includes(badge.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                  onClick={() => toggleBadge(badge.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedBadges.includes(badge.id)}
                    onChange={() => toggleBadge(badge.id)}
                    className="absolute top-2 left-2 accent-blue-600 w-4 h-4 rounded"
                    onClick={e => e.stopPropagation()}
                  />
                  <Image src={badge.image} alt={badge.name} width={48} height={48} className="rounded-full border border-gray-200 bg-white" />
                  <span className="mt-3 text-xs text-gray-700 font-medium text-center break-words">{badge.name}</span>
                </div>
              ))}
              {/* 上传勋章卡片 */}
              <div
                className="flex flex-col items-center justify-center cursor-pointer p-3 rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-50 w-[90px] h-[110px]"
                onClick={() => setShowUpload(true)}
              >
                <span className="text-3xl text-gray-400 mb-1">+</span>
                <span className="text-xs text-gray-500">上传勋章</span>
              </div>
            </div>
            {/* 上传勋章弹窗 */}
            {showUpload && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 relative flex flex-col items-center">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={handleCancelUpload}
                    aria-label="关闭"
                  >×</button>
                  <h3 className="text-lg font-bold mb-4 text-center text-blue-700">上传新勋章</h3>
                  <div className="mb-4 flex flex-col items-center">
                    {uploadPreview ? (
                      <Image src={uploadPreview} alt="预览" width={64} height={64} className="rounded-full border-2 border-blue-200 mb-2 bg-white" />
                    ) : (
                      <div
                        className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-2 cursor-pointer border-2 border-dashed border-gray-300"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-4"
                    placeholder="勋章名称"
                    value={uploadName}
                    onChange={e => setUploadName(e.target.value)}
                  />
                  <button
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold disabled:bg-gray-300 transition shadow-md hover:from-blue-600 hover:to-blue-500"
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
          <div className="mb-8">
            <label className="block font-semibold mb-2 text-gray-700">授予理由（可选）</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={3}
              placeholder="请输入授予理由..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
          {/* 授予按钮 */}
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold text-lg shadow-lg hover:from-blue-600 hover:to-blue-500 transition disabled:bg-gray-300 disabled:opacity-60"
            disabled={!selectedUsers.length || !selectedBadges.length}
            onClick={handleAward}
          >
            授予勋章
          </button>
        </section>

        {/* 中栏：选择用户模块 */}
        <section className="bg-white rounded-2xl shadow-lg p-6 w-full lg:w-[520px] flex flex-col mb-4 lg:mb-0">
          <h2 className="text-lg font-bold mb-4 text-blue-700">选择用户</h2>
          <input
            className="mb-4 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="搜索用户..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="mb-3 flex items-center gap-2">
            <input type="checkbox" checked={allSelected} onChange={toggleAllUsers} className="accent-blue-600 w-4 h-4 rounded" />
            <span className="text-sm text-gray-600">全选</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-start">
            {mockUsers.filter(u => u.name.includes(search)).map(user => (
              <div
                key={user.id}
                className={`flex flex-col items-center p-2 rounded-xl border transition cursor-pointer w-[84px] shadow-sm ${selectedUsers.includes(user.id) ? "bg-blue-50 border-blue-400" : "hover:bg-gray-100 border-transparent"}`}
                onClick={() => toggleUser(user.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                  onClick={e => e.stopPropagation()}
                  className="accent-blue-600 w-4 h-4 rounded mb-1"
                />
                <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full border border-gray-200 mb-1" />
                <span className="text-xs font-medium text-gray-800 text-center break-words leading-tight">{user.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 右栏：授予记录 */}
        <section className="bg-white rounded-2xl shadow-lg p-8 w-full lg:w-[320px] flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-blue-700">勋章授予记录</h2>
          {records.length === 0 ? (
            <div className="text-gray-400 text-center py-8">暂无授予记录</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-blue-50 text-blue-700">
                    <th className="py-2 px-3 rounded-l-xl text-left">用户</th>
                    <th className="py-2 px-3 text-left">勋章</th>
                    <th className="py-2 px-3 text-left">理由</th>
                    <th className="py-2 px-3 text-right">时间</th>
                    <th className="py-2 px-3 rounded-r-xl text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr key={idx} className="bg-white shadow-sm hover:bg-blue-50 transition">
                      <td className="py-2 px-3 rounded-l-xl">
                        <div className="flex items-center gap-2">
                          <Image src={rec.user.avatar} alt={rec.user.name} width={32} height={32} className="rounded-full border border-gray-200" />
                          <span className="font-medium text-gray-800 whitespace-nowrap">{rec.user.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <Image src={rec.badge.image} alt={rec.badge.name} width={32} height={32} className="rounded-full border border-gray-200 bg-white" />
                          <span className="text-gray-700 whitespace-nowrap">{rec.badge.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-gray-600 align-middle">{rec.reason || '-'}</td>
                      <td className="py-2 px-3 text-gray-500 text-right whitespace-nowrap">{rec.time}</td>
                      <td className="py-2 px-3 text-center rounded-r-xl">
                        <button
                          className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded transition border border-transparent hover:border-red-200 bg-red-50 hover:bg-red-100"
                          onClick={() => handleRevoke(idx)}
                        >撤回</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      {/* 动画样式 */}
      <style>{`
        .animate-fade-in { animation: fadeIn .4s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px);} to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
} 
