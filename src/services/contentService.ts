import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

// Types
export interface Experience {
    id: string;
    title: string;
    organization: string;
    duration: string;
    description: string;
    type: 'education' | 'work' | 'activity';
    order: number;
    color?: string;
}

export interface SkillCategory {
    id: string;
    category: string;
    items: string[];
    color: string;
    order: number;
}

export interface Interest {
    id: string;
    items: string[];
    note: string;
}

export interface HomeInfo {
    id: string; // 'what-i-do', 'about-me', 'vision'
    title: string;
    content: string;
    accentColor: string; // 'emerald', 'yellow', 'red'
    order: number;
}

// Collections
const EXP_COLLECTION = 'experiences';
const SKILL_COLLECTION = 'skills';
const CONTENT_COLLECTION = 'content'; // For singular docs like interests
const HOME_INFO_COLLECTION = 'home_info';

// --- Experience Service ---

export const getExperiences = async (): Promise<Experience[]> => {
    try {
        const q = query(collection(db, EXP_COLLECTION), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
    } catch (error) {
        console.error('Error fetching experiences:', error);
        return [];
    }
};

export const addExperience = async (exp: Omit<Experience, 'id'>) => {
    try {
        await addDoc(collection(db, EXP_COLLECTION), exp);
        return true;
    } catch (error) {
        console.error('Error adding experience:', error);
        return false;
    }
};

export const updateExperience = async (id: string, exp: Partial<Experience>) => {
    try {
        await updateDoc(doc(db, EXP_COLLECTION, id), exp);
        return true;
    } catch (error) {
        console.error('Error updating experience:', error);
        return false;
    }
};

export const deleteExperience = async (id: string) => {
    try {
        await deleteDoc(doc(db, EXP_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting experience:', error);
        return false;
    }
};

// --- Skill Service ---

export const getSkills = async (): Promise<SkillCategory[]> => {
    try {
        const q = query(collection(db, SKILL_COLLECTION), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillCategory));
    } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
};

export const saveSkillCategory = async (skill: SkillCategory) => {
    try {
        const { id, ...data } = skill;
        if (id) {
            await setDoc(doc(db, SKILL_COLLECTION, id), data, { merge: true });
        } else {
            await addDoc(collection(db, SKILL_COLLECTION), data);
        }
        return true;
    } catch (error) {
        console.error('Error saving skill:', error);
        return false;
    }
};

export const deleteSkillCategory = async (id: string) => {
    try {
        await deleteDoc(doc(db, SKILL_COLLECTION, id));
        return true;
    } catch (error) {
        console.error('Error deleting skill category:', error);
        return false;
    }
};

// --- Interest Service ---

export const getInterests = async (): Promise<Interest | null> => {
    try {
        const docRef = doc(db, CONTENT_COLLECTION, 'interests');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() } as Interest;
        }
        return null;
    } catch (error) {
        console.error('Error fetching interests:', error);
        return null;
    }
};

export const saveInterests = async (data: Omit<Interest, 'id'>) => {
    try {
        await setDoc(doc(db, CONTENT_COLLECTION, 'interests'), data);
        return true;
    } catch (error) {
        console.error('Error saving interests:', error);
        return false;
    }
};

// --- Home Info Service ---

export const getHomeInfos = async (): Promise<HomeInfo[]> => {
    try {
        const q = query(collection(db, HOME_INFO_COLLECTION), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HomeInfo));
    } catch (error) {
        console.error('Error fetching home info:', error);
        return [];
    }
};

export const updateHomeInfo = async (id: string, data: Partial<HomeInfo>) => {
    try {
        // Determine order and color based on ID if creates new
        await setDoc(doc(db, HOME_INFO_COLLECTION, id), data, { merge: true });
        return true;
    } catch (error) {
        console.error('Error updating home info:', error);
        return false;
    }
};

// Initialize Default Data (One-time utility)
export const initializeDefaultContent = async () => {
    // Check if data exists, if not, create defaults
    const info = await getHomeInfos();
    if (info.length === 0) {
        await updateHomeInfo('what-i-do', {
            title: 'What I Do',
            content: 'I work at the intersection of biomedical engineering, neuroscience, and information science.\n\nI build tools to think with and sometimes, I express those ideas through music.',
            accentColor: 'emerald',
            order: 1
        });
        await updateHomeInfo('about-me', {
            title: 'About Me',
            content: 'I love to learn by decomposing problems to first principles, building a deep understanding of things.',
            accentColor: 'yellow',
            order: 2
        });
        await updateHomeInfo('vision', {
            title: 'Vision',
            content: 'I seek meaning, and I aim to relieve human pain by deepening our understanding of the brain.',
            accentColor: 'red',
            order: 3
        });
    }
};
