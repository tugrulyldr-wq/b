import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, AlertTriangle, Maximize2, X, Calendar } from 'lucide-react';

// MODAL - SCROLL SORUNU ÇÖZÜLDÜ
const ExpandedModalMemo = React.memo(({ title, alarms, onClose, type }) => {
  const [internalBlink, setInternalBlink] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setInternalBlink(p => !p), 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl"
        style={{ 
          width: '95%',
          maxWidth: '1200px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="border-b-4 border-black p-4 flex justify-between items-center bg-gradient-to-r from-gray-100 to-gray-200"
          style={{ flexShrink: 0 }}
        >
          <h2 className="text-2xl font-bold flex items-center gap-3">
            {type === 'active' ? (
              <>
                <Bell size={32} className="text-red-600" />
                <span className="text-red-600">{title}</span>
              </>
            ) : (
              <>
                <CheckCircle size={32} className="text-gray-700" />
                <span className="text-gray-700">{title}</span>
              </>
            )}
            <span className={`px-4 py-1 rounded-full text-lg ${
              type === 'active' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'
            }`}>
              {alarms.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-600 hover:text-white rounded-full transition-all"
          >
            <X size={28} strokeWidth={3} />
          </button>
        </div>
        
        <div 
          style={{
            flex: 1,
            overflowY: 'scroll',
            overflowX: 'hidden',
            padding: '24px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {alarms.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <CheckCircle size={64} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                <p style={{ fontSize: '20px' }}>
                  {type === 'active' ? 'Aktif alarm yok' : 'Geçmiş alarm kaydı yok'}
                </p>
              </div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr className={`${type === 'active' ? 'bg-red-600' : 'bg-gray-700'} text-white`}>
                  <th className="border-2 border-black p-3 text-left font-bold text-lg" style={{ width: '60px' }}>#</th>
                  <th className="border-2 border-black p-3 text-left font-bold text-lg">ALARM ADI</th>
                  <th className="border-2 border-black p-3 text-left font-bold text-lg" style={{ width: '150px' }}>TARİH/SAAT</th>
                  {type === 'active' && (
                    <th className="border-2 border-black p-3 text-center font-bold text-lg" style={{ width: '180px' }}>DURUM</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {alarms.map((alarm, idx) => {
                  const shouldBlink = type === 'active' && !alarm.acknowledged;
                  const bgColor = type === 'active' 
                    ? (shouldBlink && internalBlink ? '#fee2e2' : '#ffffff')
                    : (idx % 2 === 0 ? '#f3f4f6' : '#ffffff');
                  
                  return (
                    <tr key={alarm.id} style={{ backgroundColor: bgColor }}>
                      <td className="border-2 border-gray-300 p-3 font-bold text-gray-700 text-center">
                        {idx + 1}
                      </td>
                      <td className="border-2 border-gray-300 p-3">
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                          {shouldBlink && (
                            <AlertTriangle 
                              size={18} 
                              className="text-red-600 flex-shrink-0"
                              style={{ opacity: internalBlink ? 1 : 0.3 }}
                            />
                          )}
                          <span>{alarm.name}</span>
                        </div>
                      </td>
                      <td className="border-2 border-gray-300 p-3 text-gray-700 font-mono text-sm">
                        {type === 'active' ? alarm.timestamp : (alarm.cleared_time || alarm.timestamp)}
                      </td>
                      {type === 'active' && (
                        <td className="border-2 border-gray-300 p-3 text-center">
                          {alarm.acknowledged ? (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold inline-block">
                              ✓ ACK
                            </span>
                          ) : (
                            <span 
                              className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold inline-block"
                              style={{ opacity: internalBlink ? 1 : 0.6 }}
                            >
                              ⚠ YANIP SÖNÜYOR
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        <div 
          className="border-t-4 border-black p-4 bg-gray-100 flex justify-between items-center"
          style={{ flexShrink: 0 }}
        >
          <div className="text-sm text-gray-600">
            Toplam <strong>{alarms.length}</strong> alarm {type === 'past' && '(Maks. 30)'}
          </div>
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-8 py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors"
          >
            KAPAT
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.alarms.length === nextProps.alarms.length && prevProps.type === nextProps.type;
});

const AlarmSystem = () => {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [pastAlarms, setPastAlarms] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blinking, setBlinking] = useState(true);
  const [connected, setConnected] = useState(false);
  const [expandedActive, setExpandedActive] = useState(false);
  const [expandedPast, setExpandedPast] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isManualTime, setIsManualTime] = useState(false);
  const [manualDateTime, setManualDateTime] = useState({
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: ''
  });
  const [activeField, setActiveField] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8080/ws');
      
      ws.onopen = () => {
        console.log('✓ WebSocket bağlantısı kuruldu');
        setConnected(true);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setActiveAlarms(data.active_alarms || []);
        setPastAlarms(data.past_alarms || []);
      };
      
      ws.onerror = (error) => {
        console.error('✗ WebSocket hatası:', error);
        setConnected(false);
      };

      ws.onclose = () => {
        console.log('✗ WebSocket bağlantısı kapandı, yeniden bağlanılıyor...');
        setConnected(false);
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current = ws;
    };

    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isManualTime) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isManualTime]);

  useEffect(() => {
    if (!isManualTime) return;
    
    const timer = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 60000));
    }, 60000);
    return () => clearInterval(timer);
  }, [isManualTime]);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlinking(prev => !prev);
    }, 500);
    return () => clearInterval(blinkTimer);
  }, []);

  const handleAcknowledge = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'acknowledge' }));
      console.log('✓ ACK gönderildi');
    }
  };

  const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(parseInt(fullYear), parseInt(month), 0).getDate();
  };

  const handleKeyboardInput = (num) => {
    if (!activeField) return;
    
    const currentValue = manualDateTime[activeField];
    let newValue = currentValue + num;

    if (activeField === 'year' && newValue.length > 4) return;
    if (activeField !== 'year' && newValue.length > 2) return;

    if (activeField === 'month' && parseInt(newValue) > 12) return;
    if (activeField === 'hour' && parseInt(newValue) > 23) return;
    if (activeField === 'minute' && parseInt(newValue) > 59) return;
    if (activeField === 'day') {
      const maxDays = getDaysInMonth(manualDateTime.month, manualDateTime.year);
      if (parseInt(newValue) > maxDays) return;
    }

    setManualDateTime(prev => ({ ...prev, [activeField]: newValue }));
  };

  const handleBackspace = () => {
    if (!activeField) return;
    setManualDateTime(prev => ({
      ...prev,
      [activeField]: prev[activeField].slice(0, -1)
    }));
  };

  const handleClear = () => {
    if (!activeField) return;
    setManualDateTime(prev => ({ ...prev, [activeField]: '' }));
  };

  const applyManualDateTime = () => {
    const { day, month, year, hour, minute } = manualDateTime;
    if (day && month && year && hour && minute) {
      const fullYear = year.length === 2 ? `20${year}` : year;
      const maxDays = getDaysInMonth(month, fullYear);
      const validDay = Math.min(parseInt(day), maxDays);
      
      const newDate = new Date(
        parseInt(fullYear), 
        parseInt(month) - 1, 
        validDay, 
        parseInt(hour), 
        parseInt(minute),
        0
      );
      
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const timestamp = formatDateTime(newDate);
        wsRef.current.send(JSON.stringify({ 
          action: 'set_manual_time',
          timestamp: timestamp
        }));
        console.log('✓ Manuel saat backend\'e gönderildi:', timestamp);
      }
      
      setCurrentTime(newDate);
      setIsManualTime(true);
      setShowDateTimePicker(false);
      setActiveField(null);
      setManualDateTime({ day: '', month: '', year: '', hour: '', minute: '' });
    }
  };

  const latestAlarm = activeAlarms.length > 0 ? activeAlarms[0] : null;
  const shouldBlinkLatest = latestAlarm && !latestAlarm.acknowledged;

  const DateTimePickerModal = () => {
    const maxDays = getDaysInMonth(manualDateTime.month, manualDateTime.year);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
          <div className="border-b-4 border-black p-4 bg-blue-600 text-white sticky top-0 z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar size={28} />
              TARİH VE SAAT AYARLA
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-3">TARİH</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gün (1-{maxDays})</label>
                  <input
                    type="text"
                    readOnly
                    placeholder={`01-${maxDays}`}
                    value={manualDateTime.day}
                    onFocus={() => setActiveField('day')}
                    className={`w-full border-4 rounded p-3 text-center text-2xl font-bold cursor-pointer ${
                      activeField === 'day' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Ay (1-12)</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="01-12"
                    value={manualDateTime.month}
                    onFocus={() => setActiveField('month')}
                    className={`w-full border-4 rounded p-3 text-center text-2xl font-bold cursor-pointer ${
                      activeField === 'month' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Yıl</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="2025"
                    value={manualDateTime.year}
                    onFocus={() => setActiveField('year')}
                    className={`w-full border-4 rounded p-3 text-center text-2xl font-bold cursor-pointer ${
                      activeField === 'year' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-700 mb-3">SAAT</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Saat (0-23)</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="00-23"
                    value={manualDateTime.hour}
                    onFocus={() => setActiveField('hour')}
                    className={`w-full border-4 rounded p-3 text-center text-2xl font-bold cursor-pointer ${
                      activeField === 'hour' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Dakika (0-59)</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="00-59"
                    value={manualDateTime.minute}
                    onFocus={() => setActiveField('minute')}
                    className={`w-full border-4 rounded p-3 text-center text-2xl font-bold cursor-pointer ${
                      activeField === 'minute' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="border-4 border-gray-300 rounded-lg p-4 bg-gray-100">
              <div className="text-sm font-bold text-gray-600 mb-3 text-center">
                {activeField ? `${activeField.toUpperCase()} girin` : 'Yukarıdan bir alan seçin'}
              </div>
              <div className="grid grid-cols-3 gap-2">
{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num =>(<button key={num} onClick={() => handleKeyboardInput(num.toString())}
disabled={!activeField}
className={p-4 text-2xl font-bold rounded-lg transition-all ${                       activeField                          ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'                     }}
>
{num}
</button>
))}
<button
onClick={() => handleClear()}
disabled={!activeField}
className={p-4 text-lg font-bold rounded-lg transition-all ${                     activeField                        ? 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'                   }}
>
TEMİZLE
</button>
<button
onClick={() => handleKeyboardInput('0')}
disabled={!activeField}
className={p-4 text-2xl font-bold rounded-lg transition-all ${                     activeField                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'                   }}
>
0
</button>
<button
onClick={() => handleBackspace()}
disabled={!activeField}
className={p-4 text-lg font-bold rounded-lg transition-all ${                     activeField                        ? 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'                   }}
>
⌫ SİL
</button>
</div>
</div>
</div>
      <div className="border-t-4 border-black p-4 bg-gray-100 flex gap-3 sticky bottom-0">
        <button
          onClick={() => {
            setShowDateTimePicker(false);
            setActiveField(null);
            setManualDateTime({ day: '', month: '', year: '', hour: '', minute: '' });
          }}
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
        >
          İPTAL
        </button>
        <button
          onClick={applyManualDateTime}
          disabled={!manualDateTime.day || !manualDateTime.month || !manualDateTime.year || !manualDateTime.hour || !manualDateTime.minute}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            manualDateTime.day && manualDateTime.month && manualDateTime.year && manualDateTime.hour && manualDateTime.minute
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          UYGULA
        </button>
      </div>
    </div>
  </div>
);
};
return (
<div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-8">
<div className="max-w-7xl mx-auto">
<div className="text-center mb-6 sm:mb-8">
<h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 tracking-wider drop-shadow-lg">
⚓ GEMİ ALARM SİSTEMİ ⚓
</h1>
<p className="text-gray-300 text-sm sm:text-base">Dijital İzleme ve Kayıt Sistemi</p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-white text-sm font-semibold">
          {connected ? 'SİSTEM AKTİF' : 'BAĞLANTI BEKLENİYOR...'}
        </span>
      </div>
    </div>

    <div className="bg-white border-8 border-black rounded-lg overflow-hidden shadow-2xl">
      
      <div className="border-b-8 border-black p-4 sm:p-6 bg-gray-50">
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 border-b-4 border-red-600 inline-block px-4 pb-1">
            YENİ GELEN ALARM
          </h2>
        </div>
        
        {latestAlarm ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div 
              className={`flex-1 w-full text-center py-3 sm:py-4 px-4 sm:px-6 font-bold text-lg sm:text-xl transition-all rounded bg-red-600 text-white shadow-lg`}
              style={{
                opacity: shouldBlinkLatest && !blinking ? 0.3 : 1
              }}
            >
              <AlertTriangle className="inline mr-2" size={24} />
              {latestAlarm.name}
            </div>
            <div className="text-lg sm:text-xl font-semibold text-gray-800 whitespace-nowrap">
              {latestAlarm.timestamp}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-400 text-lg sm:text-xl">
            <CheckCircle className="inline mr-2 text-green-500" size={32} />
            Aktif alarm bulunmamaktadır
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 border-b-8 border-black">
        
        <div className="border-b-8 lg:border-b-0 lg:border-r-8 border-black p-4 sm:p-6 bg-red-50" style={{ minHeight: '400px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-red-600 flex items-center gap-2">
              <Bell size={28} />
              AKTİF ALARMLAR
              {activeAlarms.length > 0 && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-base">
                  {activeAlarms.length}
                </span>
              )}
            </h3>
            {activeAlarms.length > 0 && (
              <button
                onClick={() => setExpandedActive(true)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                title="Tümünü Göster"
              >
                <Maximize2 size={20} />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {activeAlarms.slice(0, 7).map((alarm) => {
              const shouldBlinkThis = !alarm.acknowledged;
              return (
                <div 
                  key={alarm.id}
                  className={`p-2 transition-all rounded shadow-md bg-red-600 text-white ${
                    shouldBlinkThis && blinking ? 'transform scale-105' : ''
                  }`}
                  style={{
                    opacity: shouldBlinkThis && !blinking ? 0.4 : 1
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm flex items-center gap-1 flex-1">
                      {shouldBlinkThis && <AlertTriangle size={16} className="flex-shrink-0 animate-pulse" />}
                      <span className="truncate">{alarm.name}</span>
                    </div>
                    <div className="text-xs opacity-90 whitespace-nowrap">{alarm.timestamp}</div>
                  </div>
                </div>
              );
            })}
            
            {activeAlarms.length > 7 && (
              <button
                onClick={() => setExpandedActive(true)}
                className="w-full bg-red-700 text-white py-2 rounded-lg font-bold hover:bg-red-800 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Maximize2 size={18} />
                +{activeAlarms.length - 7} ALARM DAHA
              </button>
            )}
            
            {activeAlarms.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                <p className="text-lg">Aktif alarm yok</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-gray-50" style={{ minHeight: '400px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 flex items-center gap-2">
              <CheckCircle size={28} />
              GEÇMİŞ ALARMLAR
              {pastAlarms.length > 0 && (
                <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-base">
                  {pastAlarms.length}
                </span>
              )}
            </h3>
            {pastAlarms.length > 0 && (
              <button
                onClick={() => setExpandedPast(true)}
                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                title="Tümünü Göster"
              >
                <Maximize2 size={20} />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {pastAlarms.slice(0, 7).map((alarm) => (
              <div 
                key={alarm.id}
                className="bg-gray-200 p-2 border-l-4 border-gray-500 rounded shadow-sm hover:bg-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-gray-800 text-sm truncate flex-1">{alarm.name}</div>
                  <div className="text-xs text-gray-600 whitespace-nowrap">
                    {alarm.cleared_time || alarm.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {pastAlarms.length > 7 && (
              <button
                onClick={() => setExpandedPast(true)}
                className="w-full bg-gray-600 text-white py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Maximize2 size={18} />
                +{pastAlarms.length - 7} ALARM DAHA
              </button>
            )}
            
            {pastAlarms.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p className="text-lg">Geçmiş alarm kaydı yok</p>
                <p className="text-sm mt-2">(Maks. 30 alarm)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-gray-100">
        <div className="flex justify-center items-center">
          <button
            onClick={handleAcknowledge}
            disabled={!connected}
            className={`border-4 border-black px-8 sm:px-16 py-3 sm:py-4 rounded-lg font-bold text-xl sm:text-2xl transition-all flex items-center gap-3 shadow-lg ${
              connected
                ? 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 cursor-pointer hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <CheckCircle size={32} />
            ACK
          </button>
        </div>
        <div className="flex justify-center sm:justify-end items-center gap-3">
          <button
            onClick={() => setShowDateTimePicker(true)}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            title="Tarih/Saat Ayarla"
          >
            <Calendar size={24} />
          </button>
          <div className="text-center sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              TARİH/SAAT
            </div>
            <div className="text-lg sm:text-xl font-semibold text-gray-600 mt-1">
              {formatDateTime(currentTime)}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 text-center">
      <div className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg shadow-lg">
        <p className="text-sm font-bold mb-1">✅ SCROLL SORUNU ÇÖZÜLDÜ + MANUEL SAAT</p>
        <p className="text-xs opacity-80">
          7 alarm gösterilir. Manuel saat backend'e kaydedilir.
        </p>
      </div>
    </div>
  </div>

  {expandedActive && (
    <ExpandedModalMemo
      title="AKTİF ALARMLAR"
      alarms={activeAlarms}
      onClose={() => setExpandedActive(false)}
      type="active"
    />
  )}
  
  {expandedPast && (
    <ExpandedModalMemo
      title="GEÇMİŞ ALARMLAR"
      alarms={pastAlarms}
      onClose={() => setExpandedPast(false)}
      type="past"
    />
  )}

  {showDateTimePicker && <DateTimePickerModal />}
</div>
);
};
export default AlarmSystem;