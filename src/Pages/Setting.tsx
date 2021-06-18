import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { DateRange, Range } from 'react-date-range';
import { addDays } from 'date-fns';
import { TextField } from '@material-ui/core';
import { PageTitle, CalendarComponent } from '../Components';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import "../scss/pages/setting.scss";
import { TextFields } from '@material-ui/icons';
import { ChangeEventHandler } from 'react';

type rangeType = {
	[key: string]: {
		startDate: Date,
		endDate: Date,
		key: string
	}
}

const Setting = () => {
	const name = "";
	const headerTitle = "언제가 좋을까요?🤔";

	const [title, setTitle] = useState<string>("");
	const [start, setStart] = useState<string>("");
	const [end, setEnd] = useState<string>("");
	const [gap, setGap] = useState<string>("");
	const [range, setRange] = useState<rangeType>({
		'selection0': {
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection0'
		}
	});
	const [rangeNumber, setRangeNumber] = useState<number>(1);

	const handleRange = (item: any) => { setRange({ ...range, ...item }); }

	// 일정이름
	const handleTitleChange = (e: any) => {
		setTitle(e.target.value);
		// console.log(e.target.value);
	};

	//시간 배열
	const Times = [];
	for (let i = 1; i < 12; i++) {
		Times.push(i);
	}
	const amTimeList = Times.map((amTime, i) => (
		<option value={`${amTime}:00`} key={i}>오전{amTime}시</option>
	));
	const pmTimeList = Times.map((pmTime, i) => (
		<option value={`${pmTime + 12}:00`} key={i}>오후{pmTime}시</option>
	));

	const handleStartChange = (e: any) => {
		setStart(e.target.value);
	}

	const handleEndChange = (e: any) => {
		setEnd(e.target.value)
		// console.log(e.target.value);
		// console.log(parseInt(e.target.value));
		console.log(`${start} and ${e.target.value}`);
		if (parseInt(start) >= parseInt(e.target.value)) {
			alert("시간을 다시 설정해주세요.");
			setEnd("");
		}
	}

	const handleGapChange = (e: any) => {
		setGap(e.target.value)
		// console.log(e.target.value);
	}


	const handleDisabled = (date: Date) => {
		const now = new Date()
		if (date > new Date(now.setDate(now.getDate() - 1))) // 오늘 날짜가 더 이전이면 활성화
			return false; // 활성화
		return true; // 아니면 비활성화
	}

	/** range 조절 */
	const handleRangeNumber = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const num = Number(e.target.value);
		if (isNaN(num)) {
			alert("숫자를 입력해주세요.");
			return;
		}
		if(num === 0){
			alert("1 이상의 구간만 입력하실 수 있습니다.");
			return;
		}
		setRangeNumber(num);
		addRange(num);
	}

	const addRange = (num: number) => { // 문제 : range가 합쳐지지 않고 각각 생김 => 합치는 과정 진행해줘야함, range가 생길 때마다 다시 focus맞춰줘야함 (1부터 다시 시작함)
		const rangeTmp = Object.assign({}, range);
		const length = Object.keys(rangeTmp).length;
		if (length > num && confirm("선택된 구간이 더 많으므로, 구간이 삭제됩니다. 삭제할까요?")) {
			for (let i = num; i < length; i++) {
				delete rangeTmp[`selection${i}`];
			}
			console.log(num, length, rangeTmp);
			setRange(rangeTmp);
		} else {
			for (let i = length; i < num; i++) {
				rangeTmp[`selection${i}`] = {
					startDate: new Date(),
					endDate: new Date(),
					key: `selection${i}`
				}
			}
			setRange(rangeTmp);
		}
	}

	return (
		<div className="create-container">
			<div className="create-title">
				<PageTitle
					upperTitle={name}
					title={headerTitle}
				/>
				<TextField type="number" value={rangeNumber} onChange={handleRangeNumber} />
			</div>
			<div className="create-setting">
				<div className="create-calender">
					<DateRange
						onChange={handleRange}
						ranges={Object.values(range)}
						rangeColors={["#7E84F3", "#7E84F3", "#7E84F3"]}
						color={"#7E84F3"}
						disabledDay={handleDisabled}
					/>
				</div>
				<div className="create-content">
					<div className="create-content-box">
						{/* 일정이름 */}
						<div className="create-plan-name">
							<input
								placeholder="일정 이름을 작성해주세요."
								value={title}
								name="title"
								onChange={handleTitleChange}
							/>
						</div>

						{/* 시간 선택 */}
						<div className="create-time">
							<select
								className="start"
								id="start"
								name="start"
								value={start}
								onChange={handleStartChange}
							>
								<option aria-label="None" value="">
									시작시간
								</option>
								<option value="00:00">오전0시</option>
								{amTimeList}
								<option value="12:00">오후12시</option>
								{pmTimeList}
							</select>
							<div>&nbsp;&nbsp;~&nbsp;&nbsp;</div>
							<select
								className="end"
								id="end"
								name="end"
								value={end}
								onChange={handleEndChange}
							>
								<option aria-label="None" value="">
									끝시간
								</option>
								<option value="00:00">오전0시</option>
								{amTimeList}
								<option value="12:00">오후12시</option>
								{pmTimeList}
							</select>
						</div>

						{/* 간격 선택 */}
						<div className="create-gap">
							<select
								className="gap"
								id="gap"
								name="gap"
								value={gap}
								onChange={handleGapChange}
							>
								<option aria-label="None" value="">
									단위
								</option>
								<option value={15}>15분</option>
								<option value={30}>30분</option>
								<option value={60}>1시간</option>
							</select>
							<div>&nbsp;&nbsp;단위</div>
						</div>

						<div className="create-option">
							<div className="form-check form-switch create-center">
								<input className="form-check-input" type="checkbox" id="center" />
								<label className="form-check-label" htmlFor="center">중간지점도 볼래요!</label>
							</div>
							<div className="form-check form-switch create-online">
								<input className="form-check-input" type="checkbox" id="online" />
								<label className="form-check-label" htmlFor="online">화상회의로 진행할래요!</label>
							</div>
						</div>
					</div>
					<div className="create-create-btn">
						<button>일정 생성하기</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Setting;