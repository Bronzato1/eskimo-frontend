export class HourMinuteSecondFormatValueConverter {
    toView(value) {

        // 1- Convert to seconds:
        var seconds = value / 1000;

        // 2- Extract hours:
        var hours = parseInt((seconds / 3600).toString()); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours

        // 3- Extract minutes:
        var minutes = parseInt((seconds / 60).toString()); // 60 seconds in 1 minute

        // 4- Keep only seconds not extracted to minutes:
        seconds = parseInt((seconds % 60).toString());

        var output = '';

        if (hours > 0)
            output = `${hours}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
        else
            output = `${pad(minutes, 2)}:${pad(seconds, 2)}`;

        return output;
    }
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
