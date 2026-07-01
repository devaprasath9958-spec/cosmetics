import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [inputValue, setInputValue] = useState(value || "");
  const [inputError, setInputError] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value) {
      setInputValue(value);
      const [y, m, d] = value.split("-");
      if (y && m && d) {
        setCurrentDate(new Date(parseInt(y), parseInt(m) - 1, 1));
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.preventDefault();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearChange = (e) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };

  const handleMonthChange = (e) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const selectDate = (day) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    setInputValue(formatted);
    setInputError(false);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Simple regex for YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        setInputError(false);
        onChange(val);
        setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
        return;
      }
    }
    setInputError(true);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let i = 1; i <= totalDays; i++) {
      const isSelected = value === `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push(
        <button
          key={i}
          onClick={(e) => { e.preventDefault(); selectDate(i); }}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-xs transition-colors ${
            isSelected ? "bg-gold text-obsidian font-bold" : "text-ivory hover:bg-obsidian-light"
          }`}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  const years = [];
  for (let y = 1940; y <= new Date().getFullYear(); y++) {
    years.push(y);
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="YYYY-MM-DD"
          className={`w-full rounded-xl border bg-obsidian-soft px-4 py-3 pl-10 text-sm text-ivory outline-none focus:border-gold transition-colors ${
            inputError && inputValue.length > 0 ? "border-rose focus:border-rose" : "border-obsidian-border"
          }`}
        />
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke w-4 h-4 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 p-4 rounded-xl border border-obsidian-border bg-obsidian shadow-card animate-fade-up min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 text-smoke hover:text-ivory transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              <select
                value={currentDate.getMonth()}
                onChange={handleMonthChange}
                className="bg-obsidian-soft border border-obsidian-border text-ivory text-xs rounded px-2 py-1 outline-none focus:border-gold appearance-none"
              >
                {months.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
              <select
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
                className="bg-obsidian-soft border border-obsidian-border text-ivory text-xs rounded px-2 py-1 outline-none focus:border-gold appearance-none"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button onClick={handleNextMonth} className="p-1 text-smoke hover:text-ivory transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <div key={d} className="w-8 h-8 flex items-center justify-center text-[10px] uppercase tracking-wider text-smoke font-semibold">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
}
