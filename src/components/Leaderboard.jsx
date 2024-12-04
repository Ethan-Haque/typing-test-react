import React, { useState, useEffect, useRef } from "react";

const Leaderboard = ({ refreshTrigger }) => {
    const [scores, setScores] = useState([]);
    const cachedScores = useRef({});
    const [tableSentences, setTableSentences] = useState(1);
    useEffect(() => {
        // get scores from database
        fillLeaderboard();
    }, []);

    async function fillLeaderboard() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/score/all?sentencecount=${tableSentences}`,
                {
                    headers: {
                        'x-api-key': process.env.REACT_APP_WORD_API_KEY
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch scores');
            }
            const data = await response.json();
            setScores(data);
            cachedScores.current[tableSentences] = data; // Cache the scores
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    }

    useEffect(() => {
        if (cachedScores.current[tableSentences]) {
            // Use cached data if available
            setScores(cachedScores.current[tableSentences]);
        } else {
            // Fetch data from the API if not cached
            fillLeaderboard();
        }
    }, [tableSentences]);

    useEffect(() => {
        if (refreshTrigger.sentencecount) {
            setTableSentences(refreshTrigger.sentencecount);
            fillLeaderboard();
        }

    }, [refreshTrigger]);

    return (
        <div name="leaderboard" className="flex justify-center items-center h-screen text-white text-[2vmin] bg-[#0d47a1] ">
            <div className="h-[80%]">
                <div>
                    <table className="table-fixed text-left">
                        <thead className="sticky top-0 bg-[#0d47a1] block ">
                            <tr >
                                <th className="px-6 py-4 w-[20vw]">Name</th>
                                <th className="px-6 py-4 w-[20vw]">WPM</th>
                                <th className="px-6 py-4 w-[20vw]">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody className="overflow-y-scroll block h-[70vh]">
                            {/* Table Content */}
                            {scores.length > 0 && scores.map(({ username, wpm, accuracy, sentencecount }, index) => {
                                index *= 4; // multiplied by each set of keys required
                                // ex: keys for index 0: 0,1,2,3, 1: 4,5,6,7 ...
                                return (
                                    <tr key={index}>
                                        <td className="px-6 py-4  w-[20vw]" key={index + 1}>{username}</td>
                                        <td className="px-6 py-4 w-[20vw]" key={index + 2}>{wpm}</td>
                                        <td className="px-6 py-4 w-[20vw]" key={index + 3}>{accuracy}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 text-right">
                    Sentences:
                    <div className="radio">
                        {[1, 2, 3].map((count) => (
                            <React.Fragment key={count}>
                                <input
                                    type="radio"
                                    name="tableSentences"
                                    value={count}
                                    id={`tableSentences${count}`}
                                    className="radio_input"
                                    checked={tableSentences === count}
                                    onChange={() => setTableSentences(count)}
                                />
                                <label
                                    htmlFor={`tableSentences${count}`}
                                    className="radio_label"
                                >
                                    &nbsp;{count}&nbsp;
                                </label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;