function violationsFixations(complex) {

    if (complex.items.find(item => item.key_ === 'fixations')) {
        const fixations = complex.items.filter(item => item.key_ === "fixations").length > 0 ? complex.items.filter(item => item.key_ === "fixations")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "violations").length > 0 ? complex.items.filter(item => item.key_ === "violations")[0].lastvalue : 0;
        return { violations, fixations };
    }


    if (complex.items.find(item => item.key_ === 'total-fixations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]')) {
        const fixations = complex.items.filter(item => item.key_ === "total-fixations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]").length > 0 ? complex.items.filter(item => item.key_ === "total-fixations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "total-violations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]").length > 0 ? complex.items.filter(item => item.key_ === "total-violations-krechet-mysql.sh[{HOST.IP}, {$MYSQL_LOGIN}, {$MYSQL_PASSWORD}]")[0].lastvalue : 0;
        return { violations, fixations };
    }


    if (complex.items.find(item => item.key_ === 'mssFixation')) {
        const fixations = complex.items.filter(item => item.key_ === "mssFixation").length > 0 ? complex.items.filter(item => item.key_ === "mssFixation")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "mssViolation").length > 0 ? complex.items.filter(item => item.key_ === "mssViolation")[0].lastvalue : 0;
        return { violations, fixations };
    }


    if (complex.items.find(item => item.key_ === 'todays_fixations')) {
        const fixations = complex.items.filter(item => item.key_ === "todays_fixations").length > 0 ? complex.items.filter(item => item.key_ === "todays_fixations")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "todays_violations").length > 0 ? complex.items.filter(item => item.key_ === "todays_violations")[0].lastvalue : 0;
        return { violations, fixations };
    }

    if (complex.items.find(item => item.key_ === 'count_cars')) {
        const fixations = complex.items.filter(item => item.key_ === "count_cars").length > 0 ? complex.items.filter(item => item.key_ === "count_cars")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "todays_violation").length > 0 ? complex.items.filter(item => item.key_ === "todays_violation")[0].lastvalue : 0;
        return { violations, fixations };
    }

    if (complex.items.find(item => item.key_ === 'mssFixation')) {
        const fixations = complex.items.filter(item => item.key_ === "mssFixation").length > 0 ? complex.items.filter(item => item.key_ === "mssFixation")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "mssViolation").length > 0 ? complex.items.filter(item => item.key_ === "mssViolation")[0].lastvalue : 0;
        return { violations, fixations };
    }

    if (complex.items.find(item => item.key_ === 'db.odbc.get[dataF,{$ODBC_BASE}]')) {
        const fixations = complex.items.filter(item => item.key_ === "db.odbc.get[dataF,{$ODBC_BASE}]").length > 0 ? complex.items.filter(item => item.key_ === "db.odbc.get[dataF,{$ODBC_BASE}]")[0].lastvalue : 0;
        const violations = complex.items.filter(item => item.key_ === "db.odbc.get[data,{$ODBC_BASE}]").length > 0 ? complex.items.filter(item => item.key_ === "db.odbc.get[data,{$ODBC_BASE}]")[0].lastvalue : 0;
        return { violations, fixations };
    }


    const fixations = complex.items.filter(item => item.key_ === "Ptolemey.todays_passages").length > 0 ? complex.items.filter(item => item.key_ === "Ptolemey.todays_passages")[0].lastvalue : 0;
    const violations = complex.items.filter(item => item.key_ === "Ptolemey.todays_violations").length > 0 ? complex.items.filter(item => item.key_ === "Ptolemey.todays_violations")[0].lastvalue : 0;


    return { violations, fixations };
}

function itemMutator(item) {

    let name = '';
    let lastvalue = '';
    let units = '';

    switch (item.units) {
        case 'db':
        case '%':
        case 'ms':
        case 'C':
        case 'V':
        case 'A':
        case 'км/ч':
            lastvalue = Math.round(item.lastvalue);
            name = item.name;
            units = item.units;
            break;
        case '':
            lastvalue = item.lastvalue;
            name = item.name;
            units = item.units;
            break;

        case 'uptime':
            lastvalue = uptimeToString(item.lastvalue)
            name = item.name;
            units = '';
            break;

        case 'unixtime':
            lastvalue = unixTimeToString(item.lastvalue)
            name = item.name;
            break;

        default:
            lastvalue = item.lastvalue;
            name = item.name;
            units = item.units;
            break;
    }

    switch (item.key_) {
        case 'gpio3_status':
        case 'gpio2_status':
            console.log('gpio3_status');
            lastvalue = lastvalue === '0' ? 'OK' : 'FAILED';
            break
    }

    return {
        lastvalue, name, units
    }

}

function uptimeToString(uptime) {
    let totalSeconds = uptime;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor((totalSeconds - days * 86400) / 3600);
    let minutes = Math.floor((totalSeconds - hours * 3600 - days * 86400) / 60);
    let seconds = Math.floor(totalSeconds - hours * 3600 - days * 86400 - minutes * 60);
    if (days === 0) {
        if (hours === 0) {
            if (minutes === 0) {
                return `${seconds}с`
            } else {
                return `${minutes}м ${seconds}с`
            }

        } else {
            return `${hours}ч ${minutes}м`
        }
    } else {
        return `${days}д ${hours}ч`
    }

}

function unixTimeToString(unixtime) {
    let milliseconds = unixtime * 1000;
    let dateObject = new Date(milliseconds);
    return dateObject.toLocaleString();
}

function date2timestamp(strDate) {
    strDate = strDate.split("-");
    const newDate = new Date(strDate[2], strDate[1] - 1, strDate[0]);
    return newDate.getTime() / 1000;
}

module.exports = {
    violationsFixations,
    unixTimeToString,
    date2timestamp,
    uptimeToString    
}
