// ===== Backend ปลอม (ข้อมูลสมมติ เก็บใน localStorage) =====
// ชื่อตาราง/คอลัมน์ตรงกับ database aft_70 ทุกตัว ต่อ backend จริงแล้ว
// ลบไฟล์นี้ + ลบ import './mock' ใน main.js  จบ
import { api, YEAR } from './lib'

const seed = {
    // users (id, username, firstname, lastname, password, role, department, position)
    users: [
        { id: 1, username: 'user', password: '1234', firstname: 'สมชาย', lastname: 'ใจดี', role: 'user', department: 'แผนกไอที', position: 'ครูประจำวิชา' },
        { id: 2, username: 'officer', password: '1234', firstname: 'สุดา', lastname: 'รักงาน', role: 'officer', department: 'แผนกไอที', position: 'เจ้าหน้าที่บุคคล' },
        { id: 3, username: 'boss', password: '1234', firstname: 'ประเสริฐ', lastname: 'มั่นคง', role: 'boss', department: 'ฝ่ายบริหาร', position: 'ผู้อำนวยการ' },
        { id: 4, username: 'user2', password: '1234', firstname: 'มานี', lastname: 'มีนา', role: 'user', department: 'แผนกขาย', position: 'ครูประจำวิชา' },
        { id: 5, username: 'boss2', password: '1234', firstname: 'วิชัย', lastname: 'ตั้งมั่น', role: 'boss', department: 'แผนกไอที', position: 'หัวหน้าแผนก' },
    ],
    // topic (id, name, detail, weight, type) -- type 1 = 1-4 คะแนน, 2 = ผ่าน/ไม่ผ่าน
    topic: [
        { id: 1, name: 'การปฏิบัติตน', detail: 'วินัยและการทำงานร่วมกับผู้อื่น', weight: 3, type: '1' },
        { id: 2, name: 'ความรู้ความสามารถ', detail: 'ความรู้ในงานที่รับผิดชอบ', weight: 4, type: '1' },
        { id: 3, name: 'การตรงต่อเวลา', detail: 'มาปฏิบัติงานตรงตามเวลา', weight: 2, type: '2' },
    ],
    // self_answer (id, user_id, topic_id, eyal_year, self_score, base_url)
    self_answer: [
        { id: 1, user_id: 1, topic_id: 1, eyal_year: YEAR, self_score: '', base_url: '' },
        { id: 2, user_id: 1, topic_id: 2, eyal_year: YEAR, self_score: '', base_url: '' },
        { id: 3, user_id: 1, topic_id: 3, eyal_year: YEAR, self_score: '', base_url: '' },
    ],
    // boss_answers (id, boss_id, user_id, topic_id, eyal_year, score, reviews, sign)
    boss_answers: [
        { id: 1, boss_id: 3, user_id: 1, topic_id: 1, eyal_year: YEAR, score: '', reviews: '', sign: '' },
        { id: 2, boss_id: 3, user_id: 1, topic_id: 2, eyal_year: YEAR, score: '', reviews: '', sign: '' },
        { id: 3, boss_id: 3, user_id: 1, topic_id: 3, eyal_year: YEAR, score: '', reviews: '', sign: '' },
    ],
    // timetodo (time)
    timetodo: [{ time: '2026-10-01' }, { time: '2026-12-31' }],
}

// เอาของที่เคยบันทึกไว้มาทับ seed (ตารางใหม่ที่ยังไม่มีจะได้ค่าจาก seed)
const db = { ...seed, ...JSON.parse(localStorage.getItem('mockdb') || '{}') }
const save = () => localStorage.setItem('mockdb', JSON.stringify(db))
const nextid = (arr) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1)
const fail = (message) => ({ success: false, message })

const user = () => {
    try { return JSON.parse(atob(localStorage.getItem('authtoken').split('.')[1])) } catch { return {} }
}
const find = (id) => db.users.find((u) => u.id === id)
const fullname = (u) => (u ? `${u.firstname} ${u.lastname}` : '-')
const topicof = (id) => db.topic.find((t) => t.id === id)
const byrole = (role) => db.users.filter((u) => u.role === role)
const selfof = (user_id, topic_id) => db.self_answer.find((s) => s.user_id === user_id && s.topic_id === topic_id)

const routes = {
    'POST /api/register': (b) => {
        if (db.users.some((u) => u.username === b.username)) return fail('มีชื่อผู้ใช้งานนี้แล้ว')
        db.users.push({ id: nextid(db.users), role: 'user', ...b })
        save()
        return { success: true }
    },

    'POST /api/login': (b) => {
        const u = db.users.find((x) => x.username === b.username && x.password === b.password)
        if (!u) return fail('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')
        return { success: true, token: `x.${btoa(JSON.stringify({ id: u.id, role: u.role }))}.x` }
    },

    'GET /api/me': () => {
        const u = find(user().id)
        if (!u) return fail('ไม่พบผู้ใช้งาน')
        // boss = ชื่อกรรมการที่ประเมินเรา ได้จาก boss_answers (ไม่ใช่คอลัมน์ในตาราง users)
        const boss = [...new Set(db.boss_answers.filter((b) => b.user_id === u.id).map((b) => fullname(find(b.boss_id))))]
        return { success: true, data: { ...u, boss: boss.join(', ') } }
    },

    // รายชื่อแยกตาม users.role
    'GET /api/users': () => ({ success: true, data: byrole('user') }),
    'GET /api/bosses': () => ({ success: true, data: byrole('boss') }),
    'GET /api/all': () => ({ success: true, data: db.users }),

    // เปลี่ยน users.role (หน้า RoleView)
    'PUT /api/role': (b) => {
        const u = find(b.id)
        if (!u) return fail('ไม่พบผู้ใช้งาน')
        u.role = b.role
        save()
        return { success: true }
    },

    // แบบประเมินของตัวเอง (join topic มาให้เลย)
    'GET /api/myself': () => {
        const rows = db.self_answer.filter((s) => s.user_id === user().id)
        return { success: true, data: rows.map((s) => ({ ...s, ...topicof(s.topic_id), id: s.id })) }
    },

    // งานที่กรรมการคนนี้ต้องประเมิน
    'GET /api/mywork': () => {
        const rows = db.boss_answers.filter((b) => b.boss_id === user().id)
        return {
            success: true,
            data: rows.map((b) => ({ ...b, ...topicof(b.topic_id), id: b.id, username: fullname(find(b.user_id)) })),
        }
    },

    // 8.3 upload เฉพาะ .pdf ไม่เกิน 1mb และเปลี่ยนชื่อไฟล์ -> เก็บชื่อลง self_answer.base_url
    'POST /api/upload': () => ({ success: true, filename: `doc_${user().id}_${Date.now()}.pdf` }),

    // ตารางสรุปการประเมิน
    'GET /api/report': () => ({
        success: true,
        data: {
            table: db.boss_answers.map((b, i) => {
                const self = selfof(b.user_id, b.topic_id)
                return {
                    no: i + 1,
                    user: fullname(find(b.user_id)),
                    boss: fullname(find(b.boss_id)),
                    topic: topicof(b.topic_id)?.name || '-',
                    selfscore: self?.self_score || '-',
                    bossscore: b.score || '-',
                    selfdone: self?.self_score ? 'เสร็จแล้ว' : 'ยังไม่เสร็จ',
                    bossdone: b.score ? 'เสร็จแล้ว' : 'ยังไม่เสร็จ',
                }
            }),
            noassign: byrole('user').filter((u) => !db.boss_answers.some((b) => b.user_id === u.id)),
        },
    }),

    // 8.4 สำรอง / กู้คืนข้อมูล
    'GET /api/backup': () => ({ success: true, data: db }),
    'POST /api/restore': (b) => {
        if (!b.data?.users) return fail('ไฟล์สำรองไม่ถูกต้อง')
        localStorage.setItem('mockdb', JSON.stringify(b.data))
        return { success: true }
    },
}

// ---- สร้าง GET/POST/PUT/DELETE ให้ตารางจริงอัตโนมัติ ----
const tables = {
    '/api/topic': ['topic', (t) => t],
    '/api/selfanswer': ['self_answer', (s) => ({ ...s, username: fullname(find(s.user_id)), topicname: topicof(s.topic_id)?.name })],
    '/api/bossanswer': ['boss_answers', (b) => ({ ...b, username: fullname(find(b.user_id)), bossname: fullname(find(b.boss_id)), topicname: topicof(b.topic_id)?.name })],
}

for (const [url, [name, decorate]] of Object.entries(tables)) {
    routes[`GET ${url}`] = () => ({ success: true, data: db[name].map(decorate) })
    routes[`POST ${url}`] = (b) => {
        db[name].push({ id: nextid(db[name]), ...b })
        save()
        return { success: true }
    }
    routes[`PUT ${url}`] = (b) => {
        Object.assign(db[name].find((x) => x.id === b.id) || {}, b)
        save()
        return { success: true }
    }
    routes[`DELETE ${url}`] = (b, p) => {
        db[name] = db[name].filter((x) => x.id !== +p.id)
        save()
        return { success: true }
    }
}

// timetodo ไม่มีคอลัมน์ id ใช้ค่า time เป็นตัวอ้างอิงแทน
routes['GET /api/timetodo'] = () => ({ success: true, data: db.timetodo })
routes['POST /api/timetodo'] = (b) => {
    if (db.timetodo.some((t) => t.time === b.time)) return fail('มีวันที่นี้แล้ว')
    db.timetodo.push({ time: b.time })
    save()
    return { success: true }
}
routes['DELETE /api/timetodo'] = (b, p) => {
    db.timetodo = db.timetodo.filter((t) => t.time !== p.time)
    save()
    return { success: true }
}

// แทน adapter ของ axios: เรียก api.get/post ได้เหมือนมี backend จริง
api.defaults.adapter = async (config) => {
    await new Promise((r) => setTimeout(r, 200))
    const key = `${config.method.toUpperCase()} ${config.url}`
    const body = config.data ? JSON.parse(config.data) : {}
    const handler = routes[key] || (() => fail(`ไม่มี API: ${key}`))
    const out = handler(body, config.params || {})
    if (!out.success) return Promise.reject({ response: { status: 400, data: out }, message: out.message })
    return { data: out, status: 200, statusText: 'OK', headers: {}, config }
}
