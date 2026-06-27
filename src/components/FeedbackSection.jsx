import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionBackdrop from './SectionBackdrop';
import './FeedbackSection.css';

gsap.registerPlugin(ScrollTrigger);

const EMAILJS_PUBLIC_KEY = 'ZBsQyaygr0Vk9LqZO';
const EMAILJS_SERVICE = 'Mautauaja12';
const EMAILJS_TEMPLATE = 'template_4x8eo6o';

const RATING_EMOJI = ['😡', '😞', '😐', '😊', '🤩'];

export default function FeedbackSection() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from('.feedback-reveal', {
        y: 40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
      })
        .from(
          '.feedback-card',
          {
            y: 60,
            opacity: 0,
            scale: 0.96,
            duration: 0.85,
            ease: 'power3.out',
          },
          '-=0.35'
        )
        .from(
          '.feedback-field',
          {
            y: 24,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.45'
        )
        .from(
          '.feedback-form-right > *',
          {
            y: 20,
            opacity: 0,
            duration: 0.45,
            stagger: 0.1,
            ease: 'back.out(1.4)',
          },
          '-=0.35'
        )
        .from(
          '.feedback-submit',
          {
            y: 16,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setStatus({ type: 'error', msg: 'Pilih rating terlebih dahulu.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    const form = formRef.current;
    const nama = form.name.value.trim();
    const email = form.email.value.trim();
    const pesan = form.pesan.value.trim();

    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name: nama,
        from_email: email,
        message: pesan,
        rating: `${rating} / 5`,
      });
      setStatus({ type: 'success', msg: 'Pesan Anda telah berhasil terkirim. Terima kasih!' });
      form.reset();
      setRating(0);
    } catch {
      setStatus({ type: 'error', msg: 'Gagal mengirim pesan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} id="feedback" className="feedback-section">
      <SectionBackdrop variant="default" />

      <div className="feedback-inner">
        <div className="feedback-header">
          <div className="feedback-label feedback-reveal">
            <span className="feedback-line" />
            <span>Your Voice</span>
            <span className="feedback-line" />
          </div>
          <h2 className="feedback-title feedback-reveal">
            Tanggapan & <span>Penilaian</span>
          </h2>
          <p className="feedback-subtitle feedback-reveal">
            Berikan masukan dan rating untuk portfolio saya. Setiap tanggapan sangat berarti!
          </p>
        </div>

        <div className="feedback-card">
          <form ref={formRef} onSubmit={handleSubmit} className="feedback-form">
            <div className="feedback-form-grid">
              <div className="feedback-form-left">
                <div className="feedback-field">
                  <input type="text" name="name" id="fullname" required placeholder=" " />
                  <label htmlFor="fullname">Nama</label>
                </div>
                <div className="feedback-field">
                  <input type="email" name="email" id="email" required placeholder=" " />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="feedback-field feedback-field--textarea">
                  <label htmlFor="pesan" className="feedback-textarea-label">Pesan</label>
                  <textarea
                    name="pesan"
                    id="pesan"
                    rows={5}
                    required
                    placeholder="Tuliskan pesan atau saran Anda..."
                  />
                </div>
              </div>

              <div className="feedback-form-right">
                <p className="feedback-rating-label">Penilaian Portfolio</p>
                <div className="feedback-emoji-display">
                  {RATING_EMOJI[rating - 1] || '🙂'}
                </div>
                <div className="feedback-stars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`feedback-star ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      aria-label={`Rating ${star}`}
                    >
                      <i className="fas fa-star" />
                    </button>
                  ))}
                </div>
                <p className="feedback-rating-text">
                  {rating ? `${rating} dari 5 bintang` : 'Klik bintang untuk menilai'}
                </p>
              </div>
            </div>

            {status && (
              <div className={`feedback-toast feedback-toast--${status.type}`}>
                <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
                {status.msg}
              </div>
            )}

            <button type="submit" className="feedback-submit" disabled={loading}>
              <span className="feedback-submit-shine" />
              <i className="fas fa-paper-plane" />
              {loading ? 'Mengirim...' : 'Kirim Tanggapan'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
