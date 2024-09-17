import React, { useState, useEffect } from "react";
// import { getAll } from '../utils/leaderboardAPI';

const Leaderboard = () => {
    const [scores, setScores] = useState(null);
    const [tableSentences, setTableSentences] = useState(1);
    useEffect(() => {
        // get scores from database
        // getAll().then(function (response) {
        //     setScores(response.data);
        // });
    }, []);

    function changeTableSentences(amount) {
        setTableSentences(amount);
    }

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
                            {scores != null && scores.map(({ data: { name, score: { wpm, accuracy }, sentenceCount } }, index) => {
                                if (sentenceCount === tableSentences) {
                                    index *= 4; // multiplied by each set of keys required
                                    // ex: keys for index 0: 0,1,2,3, 1: 4,5,6,7 ...
                                    return (
                                        <tr key={index}>
                                            <td className="px-6 py-4  w-[20vw]" key={index + 1}>{name}</td>
                                            <td className="px-6 py-4 w-[20vw]" key={index + 2}>{wpm}</td>
                                            <td className="px-6 py-4 w-[20vw]" key={index + 3}>{accuracy}%</td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 text-right">Sentences:
                    {/* SentenceCount Radio */}
                    <div className="radio">
                        <input
                            type="radio"
                            name="tableSentences"
                            value="1"
                            id="tableSentences1"
                            className="radio_input"
                            checked={tableSentences === 1}
                            onChange={(e) => {
                                changeTableSentences(1);
                            }}
                        />
                        <label htmlFor="tableSentences1" className="radio_label">
                            &nbsp;1&nbsp;
                        </label>
                        <input
                            type="radio"
                            name="tableSentences"
                            value="2"
                            id="tableSentences2"
                            className="radio_input"
                            checked={tableSentences === 2}
                            onChange={(e) => {
                                changeTableSentences(2);
                            }}
                        />
                        <label htmlFor="tableSentences2" className="radio_label">
                            &nbsp;2&nbsp;
                        </label>
                        <input
                            type="radio"
                            name="tableSentences"
                            value="3"
                            id="tableSentences3"
                            className="radio_input"
                            checked={tableSentences === 3}
                            onChange={(e) => {
                                changeTableSentences(3);
                            }}
                        />
                        <label htmlFor="tableSentences3" className="radio_label">
                            &nbsp;3&nbsp;
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;